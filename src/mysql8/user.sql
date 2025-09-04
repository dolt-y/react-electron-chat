/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80027
 Source Host           : localhost:3306
 Source Schema         : haschat

 Target Server Type    : MySQL
 Target Server Version : 80027
 File Encoding         : 65001

 Date: 04/03/2023 13:53:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `Id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Id，自增',
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名',
  `NickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '昵称',
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '密码',
  `PersonalitySign` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '个性签名',
  `Mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `OnlineState` tinyint(0) NULL DEFAULT NULL COMMENT '在线状态',
  `Region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '地区',
  `Avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `RightPadding` int(0) NOT NULL DEFAULT 0 COMMENT '右边距，仅需要该字段用于移动端',
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邮箱',
  `HistorySessionList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '历史会话列表',
  `OutTradeNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'socket.id',
  `NoCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '时间戳',
  PRIMARY KEY (`Id`, `NickName`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '玛格丽特', '茶花女', '123456', '是谁来自山川湖海 却囿于昼夜厨房与爱.', '1320245621X', 0, '法国 巴黎', 'https://howcode.online/photo/project/pSeE5fs.jpg', 0, 'test@163.com', '[{\"Id\":9,\"Name\":\"梭罗\",\"NickName\":\"瓦尔登湖\",\"Password\":\"123456\",\"PersonalitySign\":\"但更多的时间，我用来幻想，而且回忆，回忆在有一个岛上做过的有意义和无意义的事情，一直到半夜，到半夜以后。有些事情，曾经恨过的，再恨一次；曾经恋过的，再恋一次；有些无聊，甚至再无聊一次。一切都离我很久，很远。我不知道，我的寂寞应该以时间或空间为半径。就这样，我独自坐到午夜以后，看窗外的夜比《圣经·旧约》更黑，万籁俱死之中，听两颊的胡髭无赖地长着，应和着腕表巡回的秒针。\",\"Mobile\":\"1320245621X\",\"OnlineState\":true,\"Region\":\"美国 波士顿\",\"Avatar\":\"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e9420bcd-26cd-4faf-b47a-9949982f7c41/a9f8c221-612a-45ca-9d9d-286b73649880.jpeg\",\"RightPadding\":0,\"Email\":\"jlddb3@163.com\",\"HistorySessionList\":\"\",\"OutTradeNo\":\"iU2bLURYCpYQpF0bAAAB\",\"NoCode\":\"1670892386544\"},{\"Id\":5,\"Name\":\"何塞·阿尔卡蒂奥·布恩迪亚\",\"NickName\":\"百年孤独\",\"Password\":\"123456\",\"PersonalitySign\":\"生命中曾经有过的所有灿烂，终究都需要用寂寞来偿还。\",\"Mobile\":\"1320245621X\",\"OnlineState\":true,\"Region\":\"加勒比海 马孔多,\",\"Avatar\":\"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e9420bcd-26cd-4faf-b47a-9949982f7c41/ffc7bae9-3625-4ea0-8678-77bcfc5eb003.jpeg\",\"RightPadding\":0,\"Email\":\"rtzfr1@163.com\",\"HistorySessionList\":\"\",\"OutTradeNo\":\"LZHas3Z6EXr9dKh6AAAD\",\"NoCode\":\"1670901391705\"}]', 'QYgugH1aUGy6c1OhAAAD', '1673341272898');
INSERT INTO `user` VALUES (2, '阿米尔', '追风筝的人', '123456', '希望你适应孤独，以及它带给我们的一切。毕竟一个人要走的路很长，我们总要尝试一个人看一场电影，一个人坐在图书馆里看完一本书，一个人撒欢地坐上公交车在回家的路上，无拘无束，想看书就看书，饿了就吃，累了就睡觉，不想联络谁就自己安静一阵。', '1320245621X', 1, '阿富汗 喀布尔', 'https://howcode.online/photo/project/pSeE66P.jpg', 0, 'xlrfj5@163.com', '[{\"Id\":13,\"Name\":\"韩子奇\",\"NickName\":\"穆斯林的葬礼\",\"Password\":\"123456\",\"PersonalitySign\":\"\",\"Mobile\":\"1320245621X\",\"OnlineState\":true,\"Region\":\"中国\",\"Avatar\":\"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e9420bcd-26cd-4faf-b47a-9949982f7c41/5381b73e-b138-45e2-a955-3bba2fd7a685.jpeg\",\"RightPadding\":0,\"Email\":\"znfht7@163.com\",\"HistorySessionList\":\"\",\"OutTradeNo\":\"rtU023B_8_ATbwl6AAAN\",\"NoCode\":\"1654507386722\"},{\"Id\":9,\"Name\":\"梭罗\",\"NickName\":\"瓦尔登湖\",\"Password\":\"123456\",\"PersonalitySign\":\"但更多的时间，我用来幻想，而且回忆，回忆在有一个岛上做过的有意义和无意义的事情，一直到半夜，到半夜以后。有些事情，曾经恨过的，再恨一次；曾经恋过的，再恋一次；有些无聊，甚至再无聊一次。一切都离我很久，很远。我不知道，我的寂寞应该以时间或空间为半径。就这样，我独自坐到午夜以后，看窗外的夜比《圣经·旧约》更黑，万籁俱死之中，听两颊的胡髭无赖地长着，应和着腕表巡回的秒针。\",\"Mobile\":\"1320245621X\",\"OnlineState\":true,\"Region\":\"美国 波士顿\",\"Avatar\":\"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e9420bcd-26cd-4faf-b47a-9949982f7c41/a9f8c221-612a-45ca-9d9d-286b73649880.jpeg\",\"RightPadding\":0,\"Email\":\"jlddb3@163.com\",\"HistorySessionList\":\"\",\"OutTradeNo\":\"iU2bLURYCpYQpF0bAAAB\",\"NoCode\":\"1670892386544\"}]', 'f_JoWFlyQcZwYYM0AACR', '1670919418656');
INSERT INTO `user` VALUES (3, '维特', '少年维特的烦恼', '123456', '有时，写的东西没人看或被嘲讽，会觉得这个世界没人懂我，但这几年下来，已不痛不痒。一个人到电影院，一边看自己喜欢电影，一边傻笑，也不失为乐趣。偶尔趁舍友出去的邂逅黄昏傍晚，吹点小风，喝点热茶，放点轻快的音乐在宿舍里扭两下，也是一种享受。没人陪你跑步，就尝试独自慢跑；觉得进像样餐厅尴尬，就跑叫外卖；没人为你解题，那就再冥思苦想，一切都会水到渠成；没人陪你说话，你可以尝试写日记，把想说的话写下来，让日记做你的朋友。', '1320245621X', 0, '德国 柏林', 'https://howcode.online/photo/project/pSe5D10.jpg', 0, 'vhznx7@163.com', '[{\"Id\":9,\"Name\":\"梭罗\",\"NickName\":\"瓦尔登湖\",\"Password\":\"123456\",\"PersonalitySign\":\"但更多的时间，我用来幻想，而且回忆，回忆在有一个岛上做过的有意义和无意义的事情，一直到半夜，到半夜以后。有些事情，曾经恨过的，再恨一次；曾经恋过的，再恋一次；有些无聊，甚至再无聊一次。一切都离我很久，很远。我不知道，我的寂寞应该以时间或空间为半径。就这样，我独自坐到午夜以后，看窗外的夜比《圣经·旧约》更黑，万籁俱死之中，听两颊的胡髭无赖地长着，应和着腕表巡回的秒针。\",\"Mobile\":\"1320245621X\",\"OnlineState\":true,\"Region\":\"美国 波士顿\",\"Avatar\":\"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e9420bcd-26cd-4faf-b47a-9949982f7c41/a9f8c221-612a-45ca-9d9d-286b73649880.jpeg\",\"RightPadding\":0,\"Email\":\"jlddb3@163.com\",\"HistorySessionList\":\"\",\"OutTradeNo\":\"iU2bLURYCpYQpF0bAAAB\",\"NoCode\":\"1670892386544\"}]', 'uuqAWkNA0up7A4_iAAAN', '1673342754779');
INSERT INTO `user` VALUES (4, '思特里克兰德', '月亮和六便士', '123456', '如果天空是黑暗的，那就摸黑生存；如果发出声音是危险的，那就保持沉默；如果自觉无力发光的，那就蜷伏于墙角。但不要习惯了黑暗就为黑暗辩护；不要为自己的苟且而得意；不要嘲讽那些比自己更勇敢热情的人们。我们可以卑微如尘土，不可扭曲如蛆虫。', '1320245621X', 0, '英国 伦敦', 'https://howcode.online/photo/project/pSeEDfA.jpg', 0, 'nhzbz5@163.com', NULL, 'luVYNrYGusY_vhRSAAB5', '1671167626970');
INSERT INTO `user` VALUES (5, '何塞·阿尔卡蒂奥·布恩迪亚', '百年孤独', '123456', '生命中曾经有过的所有灿烂，终究都需要用寂寞来偿还。', '1320245621X', 0, '加勒比海 马孔多,', 'https://howcode.online/photo/project/pSe56nU.jpg', 0, 'rtzfr1@163.com', NULL, 'cvfvr7XsPQMLL3TIAAAF', '1671005989559');
INSERT INTO `user` VALUES (6, '卡雷特·奥哈拉', '飘', '123456', '有人夸你优秀 便有人说你不过如此 有人说你随性 便有人说你做作 有人说你实在 就有人说你虚伪.你活在这个世上永远不可能让所有喜欢你 你每次因为他人的三言两语而停下自己的脚步 每次因为某些人始终不能认可你而闷闷不乐 可你在最后的最后终会明白，你的人生就是你的，冷暖都是你的。', '1320245621X', 0, '美国 佐治亚州', 'https://howcode.online/photo/project/pSe5rcV.jpg', 0, 'zntrh3@163.com', NULL, 'nq7rKmThljo7L7g8AAAB', '1676694596140');
INSERT INTO `user` VALUES (7, '叶藏', '人间失格', '123456', '如果有人在背后议论你，那只能说明你活的比他们精彩许多。不要惧怕那些路上的荆棘，不要在意那些冷眼与嘲讽，哪怕做一只小小的萤火虫，也有属于自己的光芒，这份光芒真实而美丽。因为你的光芒耀眼才会有旁人的质疑与伤害，因为你的光芒不同才会有他人的阻拦和否定，这一切的一切都是因为你拥有他们所没有的光芒。冷嘲热讽是对你的赞赏，闲言碎语是为你的精彩鼓掌。', '1320245621X', 0, '日本', 'https://howcode.online/photo/project/pSe5sXT.jpg', 0, 'hphjt9@163.com', NULL, 'RTy4IxiKpSvpVdcsAABT', '1670918074489');
INSERT INTO `user` VALUES (8, '史铁生', '我与地坛', '123456', '古人说你不能做的事情，你倒应该试一试，你会发现你能做。旧的行为适合旧的人，新的行为适合新的人。古人可能就是不知道添上新柴可以使火一直燃烧；新人却可以在锅底下放上干柴生起炉火，而且以鸟儿飞翔的速度遨游地球，正如谚语所说：气死古人。活了一把岁数未必就有充分的资格做年轻人的指路人，因为活到老所获得的不见得比失去的多。', '1320245621X', 0, '中国 北京', 'https://howcode.online/photo/project/pSeEUeO.jpg', 0, 'tlprp3@163.com', NULL, 'ph43PJnipTdOKPXYAAAL', '1676694596140');
INSERT INTO `user` VALUES (9, '梭罗', '瓦尔登湖', '123456', '但更多的时间，我用来幻想，而且回忆，回忆在有一个岛上做过的有意义和无意义的事情，一直到半夜，到半夜以后。有些事情，曾经恨过的，再恨一次；曾经恋过的，再恋一次；有些无聊，甚至再无聊一次。一切都离我很久，很远。我不知道，我的寂寞应该以时间或空间为半径。就这样，我独自坐到午夜以后，看窗外的夜比《圣经·旧约》更黑，万籁俱死之中，听两颊的胡髭无赖地长着，应和着腕表巡回的秒针。', '1320245621X', 1, '美国 波士顿', 'https://howcode.online/photo/project/pSeEdTe.jpg', 0, 'jlddb3@163.com', NULL, 'f7p7Z2-u0gdJsY5JAACP', '1671168375380');
INSERT INTO `user` VALUES (10, '公埃斯梅拉达', '巴黎圣母院', '123456', '', '1320245621X', 0, '法国 巴黎', 'https://howcode.online/photo/project/pSe5g74.jpg', 0, 'jjprh9@163.com', NULL, 'm2HYLRqiD2f_kScfAABD', '1671166497139');
INSERT INTO `user` VALUES (11, '苏菲', '苏菲的世界', '123456', '', '1320245621X', 0, '挪威', 'https://howcode.online/photo/project/pSe5cBF.jpg', 0, 'fbthl3@163.com', NULL, '--DxW3vdMdqIFoVcAAAP', '1676705827867');
INSERT INTO `user` VALUES (12, '桑提亚哥', '老人与海', '123456', '在某种意义上，所有事物都在互相残杀。捕鱼就是要了我的老命，可是它同时也养活我。', '1320245621X', 0, '', 'https://howcode.online/photo/project/pSeE4Yj.jpg', 0, 'xjbdb9@163.com', NULL, 'LAs3HQAKLBO5vSmJAAAX', '1676706610142');
INSERT INTO `user` VALUES (13, '韩子奇', '穆斯林的葬礼', '123456', '', '1320245621X', 0, '中国', 'https://howcode.online/photo/project/pSeEhkQ.jpg', 0, 'znfht7@163.com', NULL, 'nEH8Mq0Oxi4RwVaZAABZ', '1671167192068');
INSERT INTO `user` VALUES (32, 'howcode', 'howcode', '123456', NULL, NULL, 0, NULL, 'https://howcode.online/photo/project/pSeEawD.jpg', 0, '253825039@qq.com', NULL, 'VDLYXveWkQpQ963iAAAJ', '1671006033799');

SET FOREIGN_KEY_CHECKS = 1;
