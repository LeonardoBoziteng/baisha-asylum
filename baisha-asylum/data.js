/* ═══════════════════════════════════════
   照片墙数据
   想加照片：把照片放进 photos/ 文件夹，
   然后在这里加一行 { src: "photos/文件名", caption: "说明文字" }
   ═══════════════════════════════════════ */
const PHOTO_WALL = [
  { src: "photos/wall-1.jpg", caption: "照片 1" },
  { src: "photos/wall-2.jpg", caption: "照片 2" },
  { src: "photos/wall-3.jpg", caption: "照片 3" },
  { src: "photos/wall-4.jpg", caption: "照片 4" },
  { src: "photos/wall-5.jpg", caption: "照片 5" },
  { src: "photos/wall-6.jpg", caption: "照片 6" }
];

/* ═══════════════════════════════════════
   病友档案数据
   1. name     → 昵称
   2. title    → 称号（留空则不显示）
   3. birthday → 生日
   4. mbti     → MBTI 类型
   5. stand    → 自担
   6. idCard   → 身份证号（建议打码）
   7. photo    → 大头照文件名（photos/ 文件夹）
   8. photos   → 详情页照片墙文件名列表
   ═══════════════════════════════════════ */
const PATIENTS = [
  {
    id: "BSJ-001",
    name: "人机",
    title: "",
    birthday: "02.26",
    mbti: "ENFP",
    stand: "大黑塔",
    idCard: "53262*************",
    photo: "photos/BSJ-001.jpg",
    photos: ["photos/BSJ-001-1.jpg", "photos/BSJ-001-2.jpg", "photos/BSJ-001-3.jpg", "photos/BSJ-001-4.jpg", "photos/BSJ-001-5.jpg"]
  },
  {
    id: "BSJ-002",
    name: "(●—●)",
    title: "",
    birthday: "11.28",
    mbti: "ISFJ",
    stand: "花怜",
    idCard: "53087*************",
    photo: "photos/BSJ-002.jpg",
    photos: ["photos/BSJ-002-1.jpg", "photos/BSJ-002-2.jpg"]
  },
  {
    id: "BSJ-003",
    name: "澄",
    title: "",
    birthday: "0208",
    mbti: "INTP",
    stand: "那刻夏",
    idCard: "53030*************",
    photo: "photos/BSJ-003.jpg",
    photos: ["photos/BSJ-003-1.jpg", "photos/BSJ-003-2.jpg", "photos/BSJ-003-3.jpg", "photos/BSJ-003-4.jpg", "photos/BSJ-003-5.jpg", "photos/BSJ-003-6.jpg"]
  },
  {
    id: "BSJ-004",
    name: "严密",
    title: "",
    birthday: "0807",
    mbti: "ENFP",
    stand: "万敌",
    idCard: "53012*************",
    photo: "photos/BSJ-004.jpg",
    photos: ["photos/BSJ-004-1.jpg", "photos/BSJ-004-2.jpg", "photos/BSJ-004-3.jpg", "photos/BSJ-004-4.jpg"]
  },
  {
    id: "BSJ-005",
    name: "水母",
    title: "",
    birthday: "11.18",
    mbti: "INTP",
    stand: "佚名",
    idCard: "36012*************",
    photo: "photos/BSJ-005.jpg",
    photos: ["photos/BSJ-005-1.jpg", "photos/BSJ-005-2.jpg", "photos/BSJ-005-3.jpg", "photos/BSJ-005-4.jpg"]
  },
  {
    id: "BSJ-006",
    name: "日落屿轩",
    title: "",
    birthday: "01.24",
    mbti: "INTJ",
    stand: "宋亚轩",
    idCard: "53012*************",
    photo: "photos/BSJ-006.jpg",
    photos: ["photos/BSJ-006-1.jpg", "photos/BSJ-006-2.jpg", "photos/BSJ-006-3.jpg", "photos/BSJ-006-4.jpg"]
  }
];
