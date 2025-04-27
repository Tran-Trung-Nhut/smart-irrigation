export const turnOnWater: string[] = [
    "bật máy bơm",
    "bật bơm nước",
    "mở máy bơm",
    "mở bơm nước",
    "mở nước",
    "bật nước",
    "mở bơm",
    "bật bơm",
    "khởi động máy bơm",
    "khởi động bơm nước",
    "chạy máy bơm",
    "chạy bơm nước",
    "mở hệ thống tưới",
    "bật hệ thống tưới",
    "mở tưới nước",
    "bật tưới nước",
    "mở van nước",
    "bật van nước",
    "mở máy tưới",
    "bật máy tưới"
];

export const turnOffWater: string[] = [
    "tắt máy bơm",
    "tắt bơm nước",
    "tắt nước",
    "tắt bơm",
    "ngưng máy bơm",
    "ngưng bơm nước",
    "dừng máy bơm",
    "dừng bơm nước",
    "tắt hệ thống tưới",
    "ngưng hệ thống tưới",
    "tắt tưới nước",
    "ngưng tưới nước",
    "đóng van nước",
    "tắt van nước",
    "tắt máy tưới",
    "ngưng máy tưới"
];

export const turnOnFan: string[] = [
    "bật quạt",
    "mở quạt",
    "khởi động quạt",
    "chạy quạt",
    "bật máy quạt",
    "mở máy quạt",
    "bật quạt gió",
    "mở quạt gió",
    "bật hệ thống quạt",
    "mở hệ thống quạt",
    "bật gió",
    "mở gió",
    "bật quạt thông gió",
    "mở quạt thông gió"
];

export const turnOffFan: string[] = [
    "tắt quạt",
    "ngưng quạt",
    "dừng quạt",
    "tắt máy quạt",
    "ngưng máy quạt",
    "dừng máy quạt",
    "tắt quạt gió",
    "ngưng quạt gió",
    "tắt hệ thống quạt",
    "ngưng hệ thống quạt",
    "tắt gió",
    "ngưng gió",
    "tắt quạt thông gió",
    "ngưng quạt thông gió"
];

export const turnOnLight: string[] = [
    "bật đèn",
    "mở đèn",
    "bật ánh sáng",
    "mở ánh sáng",
    "bật đèn uv",
    "mở đèn uv",
    "khởi động đèn",
    "chạy đèn",
    "bật hệ thống đèn",
    "mở hệ thống đèn",
    "bật đèn chiếu sáng",
    "mở đèn chiếu sáng",
    "bật đèn tưới",
    "mở đèn tưới"
];

export const turnOffLight: string[] = [
    "tắt đèn",
    "ngưng đèn",
    "dừng đèn",
    "tắt ánh sáng",
    "ngưng ánh sáng",
    "tắt đèn uv",
    "ngưng đèn uv",
    "tắt hệ thống đèn",
    "ngưng hệ thống đèn",
    "tắt đèn chiếu sáng",
    "ngưng đèn chiếu sáng",
    "tắt đèn tưới",
    "ngưng đèn tưới"
];

export const turnOffAllDevices: string[] = [
    "tắt tất cả",
    "tắt toàn bộ",
    "tắt mọi thiết bị",
    "tắt hết",
    "tắt toàn bộ hệ thống",
    "tắt toàn hệ thống"
];

export const turnOnAllDevices: string[] = [
    "bật tất cả",
    "bật toàn bộ",
    "bật mọi thiết bị",
    "bật hết",
    "bật toàn bộ hệ thống",
    "bật toàn hệ thống"
];

export const viewChartCommands: string[] = [
    "xem biểu đồ",
    "hiển thị biểu đồ",
    "mở biểu đồ",
    "xem đồ thị",
    "biểu đồ",
    "đồ thị",
    "xem dữ liệu trực quan",
    "dữ liệu trực quan"
];

export const viewNotifications: string [] = [
    "xem thông báo",
    "thông báo",
    "hiển thị thông báo",
    "mở thông báo",
    "xem danh sách thông báo",
    "danh sách thông báo",
    "hiển thị danh sách thông báo",
    "mở danh sách thông báo"
]

export const scheduleCommands: string[] = [
    "đặt lịch",
    "lập lịch",
    "tạo lịch",
    "thiết lập lịch",
    "tạo hẹn giờ",
    "cài hẹn giờ",
    "cài đặt lịch",
    "lên lịch",
    "hẹn giờ",
    "lúc"
];


export const checkIncludeText = (voiceText: string, voiceCommands: string[]): boolean => {
    for (const voiceCommand of voiceCommands) {
        if (voiceText.toLowerCase().includes(voiceCommand)) {
            return true;
        }
    }
    return false;
}