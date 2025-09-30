import { useState, useRef } from "react";
import styles from "./resizableSidebar.module.scss";

interface ResizableSidebarProps {
    children: React.ReactNode;
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    rightDragSensitivity?: number; // 控制向右拖动灵敏度
}

export const ResizableSidebar: React.FC <ResizableSidebarProps> = ({
    children,
    defaultWidth = 280,
    minWidth = 250,
    maxWidth = 500,
    rightDragSensitivity = 0.6, // 0~1，越小越慢
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);
    const widthRef = useRef(defaultWidth);
    const lastClientX = useRef(0);
    const ticking = useRef(false);

    const [width, setWidth] = useState(defaultWidth);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizing.current = true;
        lastClientX.current = e.clientX;
        document.body.style.userSelect = "none";
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current || !containerRef.current) return;

        let deltaX = e.clientX - lastClientX.current;

        // 向右拖动减缓
        if (deltaX > 0) {
            deltaX *= rightDragSensitivity;
        }

        widthRef.current = Math.min(Math.max(widthRef.current + deltaX, minWidth), maxWidth);
        lastClientX.current = e.clientX;

        if (!ticking.current) {
            ticking.current = true;
            requestAnimationFrame(() => {
                if (containerRef.current) {
                    containerRef.current.style.width = `${widthRef.current}px`;
                }
                ticking.current = false;
            });
        }
    };

    const handleMouseUp = () => {
        if (!isResizing.current) return;

        setWidth(widthRef.current);
        isResizing.current = false;
        document.body.style.userSelect = "auto";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    return (
        <div ref={containerRef} className={styles.sidebar} style={{ width }}>
            <div className={styles.sidebarContent}>{children}</div>
            <div className={styles.handle} onMouseDown={handleMouseDown} />
        </div>
    );
};
