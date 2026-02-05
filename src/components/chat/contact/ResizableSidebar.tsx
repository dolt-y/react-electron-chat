/**
 * @author wen
 * @desc 可调整大小的多方向侧边栏组件
 */
import { useState, useRef, type CSSProperties } from "react";
import styles from "./resizableSidebar.module.scss";

type ResizeDirection = "left" | "right" | "top" | "bottom";

interface ResizableSidebarProps {
    children: React.ReactNode;
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
    direction?: ResizeDirection;
    dragSensitivity?: number; // 拖动灵敏度
    className?: string;
}

export const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
    children,
    defaultSize = 280,
    minSize = 250,
    maxSize = 500,
    direction = "right",
    dragSensitivity = 0.5,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);
    const sizeRef = useRef(defaultSize);
    const lastClient = useRef(0);
    const ticking = useRef(false);

    const [size, setSize] = useState(defaultSize);
    const isHorizontal = direction === "left" || direction === "right";

    const getClientValue = (event: { clientX: number; clientY: number }) => {
        if (isHorizontal) return event.clientX;
        return event.clientY;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizing.current = true;
        lastClient.current = getClientValue(e);
        document.body.style.userSelect = "none";
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current || !containerRef.current) return;

        const client = getClientValue(e);
        let delta = client - lastClient.current;

        // 左和上方向需要反向计算
        if (direction === "left" || direction === "top") {
            delta = -delta;
        }

        delta *= dragSensitivity;

        sizeRef.current = Math.min(Math.max(sizeRef.current + delta, minSize), maxSize);
        lastClient.current = client;

        if (!ticking.current) {
            ticking.current = true;
            requestAnimationFrame(() => {
                if (!containerRef.current) return;

                if (isHorizontal) {
                    containerRef.current.style.width = `${sizeRef.current}px`;
                } else {
                    containerRef.current.style.height = `${sizeRef.current}px`;
                }

                ticking.current = false;
            });
        }
    };

    const handleMouseUp = () => {
        if (!isResizing.current) return;
        setSize(sizeRef.current);
        isResizing.current = false;
        document.body.style.userSelect = "auto";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const containerStyle: CSSProperties = {};
    if (isHorizontal) {
        containerStyle.width = size;
    } else {
        containerStyle.height = size;
    }

    const containerClassName = [styles.sidebar, className].filter(Boolean).join(" ");

    return (
        <div ref={containerRef} className={containerClassName} style={containerStyle}>
            <div className={styles.sidebarContent}>{children}</div>
            <div className={`${styles.handle} ${styles[direction]}`} onMouseDown={handleMouseDown} />
        </div>
    );
};
