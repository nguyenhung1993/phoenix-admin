const BASE_EMAIL_STYLE = `
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f5; margin: 0; padding: 0; }
    .email-wrapper { width: 100%; table-layout: fixed; background-color: #f4f4f5; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
    .header { background-color: #bc2c26; padding: 24px; text-align: center; color: #ffffff; }
    .header h2 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
    .content { padding: 32px 24px; }
    .content p { margin: 0 0 16px 0; font-size: 16px; color: #4b5563; }
    .content strong { color: #111827; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: #bc2c26; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; }
    .detail-box { background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; margin: 24px 0; }
    .detail-box p { margin: 0 0 8px 0; font-size: 15px; }
    .detail-box p:last-child { margin: 0; }
    .footer { background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 0 0 8px 0; font-size: 13px; color: #64748b; }
`;

export const getWelcomeEmailTemplate = (candidateName: string, jobTitle: string) => {
    return `
<!DOCTYPE html>
<html>
<head><style>${BASE_EMAIL_STYLE}</style></head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <h2>Phoenix HRMS</h2>
            </div>
            <div class="content">
                <h3 style="color: #111827; margin-top: 0; font-size: 20px;">Hồ sơ ứng tuyển đã được tiếp nhận</h3>
                <p>Xin chào <strong>${candidateName}</strong>,</p>
                <p>Cảm ơn bạn đã quan tâm và ứng tuyển vào vị trí <strong>${jobTitle}</strong> tại Phoenix.</p>
                <p>Chúng tôi đã nhận được hồ sơ của bạn và hệ thống đang trong quá trình ghi nhận. Bộ phận tuyển dụng sẽ xem xét năng lực của bạn và liên hệ lại trong thời gian sớm nhất nếu hồ sơ phù hợp với yêu cầu hiện tại.</p>
                <br/>
                <p>Trân trọng,</p>
                <p><strong>Bộ phận Tuyển dụng Phoenix</strong></p>
            </div>
            <div class="footer">
                <p>Đây là email tự động. Vui lòng không trả lời.</p>
                <p>&copy; ${new Date().getFullYear()} Phoenix. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

export const getInterviewEmailTemplate = (candidateName: string, jobTitle: string, date: string, type: string, location: string | null, link: string | null) => {
    return `
<!DOCTYPE html>
<html>
<head><style>${BASE_EMAIL_STYLE}</style></head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <h2>Phoenix HRMS</h2>
            </div>
            <div class="content">
                <h3 style="color: #111827; margin-top: 0; font-size: 20px;">Thư mời phỏng vấn - ${jobTitle}</h3>
                <p>Xin chào <strong>${candidateName}</strong>,</p>
                <p>Chúc mừng bạn đã vượt qua vòng sơ loại hồ sơ cho vị trí <strong>${jobTitle}</strong>.</p>
                <p>Chúng tôi trân trọng mời bạn tham gia buổi phỏng vấn đánh giá năng lực với chi tiết như sau:</p>
                
                <div class="detail-box">
                    <p><strong>Thời gian:</strong> ${date}</p>
                    <p><strong>Hình thức phỏng vấn:</strong> ${type}</p>
                    ${location ? `<p><strong>Địa điểm:</strong> ${location}</p>` : ''}
                    ${link ? `<p><strong>Link tham gia Online:</strong> <a href="${link}" style="color: #bc2c26;">Tham gia phỏng vấn tại đây</a></p>` : ''}
                </div>
                
                <p>Vui lòng xác nhận khả năng tham gia của bạn bằng cách trả lời (Reply) trực tiếp vào email này.</p>
                <br/>
                <p>Trân trọng,</p>
                <p><strong>Bộ phận Tuyển dụng Phoenix</strong></p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Phoenix. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

export const getOfferEmailTemplate = (candidateName: string, jobTitle: string, salary: string, startDate: string) => {
    return `
<!DOCTYPE html>
<html>
<head><style>${BASE_EMAIL_STYLE}</style></head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <h2>Phoenix HRMS</h2>
            </div>
            <div class="content">
                <h3 style="color: #111827; margin-top: 0; font-size: 20px;">Thư mời nhận việc (Offer Letter)</h3>
                <p>Xin chào <strong>${candidateName}</strong>,</p>
                <p>Chúng tôi rất vui mừng thông báo bạn đã trúng tuyển vị trí <strong>${jobTitle}</strong> tại Phoenix!</p>
                <p>Dựa trên sự thể hiện xuất sắc của bạn trong các vòng phỏng vấn, chúng tôi xin gửi đến bạn lời mời làm việc chính thức với các thông tin tóm tắt sau:</p>
                
                <div class="detail-box">
                    <p><strong>Vị trí:</strong> ${jobTitle}</p>
                    <p><strong>Mức lương thoả thuận:</strong> ${salary} VND</p>
                    <p><strong>Ngày bắt đầu làm việc dự kiến:</strong> ${startDate}</p>
                </div>
                
                <p>Chi tiết về offer chính thức cùng các chế độ phúc lợi đã được đính kèm trong thư này hoặc sẽ được chia sẻ thông qua điện thoại bởi chuyên viên nhân sự của chúng tôi.</p>
                <p>Chúng tôi rất mong chờ được chào đón bạn gia nhập đội ngũ Phoenix!</p>
                <br/>
                <p>Trân trọng,</p>
                <p><strong>Bộ phận Nhân sự Phoenix</strong></p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Phoenix. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

export const getRejectionEmailTemplate = (candidateName: string, jobTitle: string) => {
    return `
<!DOCTYPE html>
<html>
<head><style>${BASE_EMAIL_STYLE}</style></head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header" style="background-color: #64748b;">
                <h2>Phoenix HRMS</h2>
            </div>
            <div class="content">
                <h3 style="color: #111827; margin-top: 0; font-size: 20px;">Thông báo kết quả ứng tuyển</h3>
                <p>Xin chào <strong>${candidateName}</strong>,</p>
                <p>Cảm ơn bạn đã quan tâm và dành thời gian quý báu tham gia ứng tuyển vào vị trí <strong>${jobTitle}</strong> tại Phoenix.</p>
                <p>Chúng tôi rất ấn tượng với những kỹ năng và kinh nghiệm bạn đã chia sẻ. Tuy nhiên, sau khi xem xét kỹ lưỡng và cân nhắc với yêu cầu hiện tại của vị trí, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn chưa thật sự đồng điệu với định hướng phát triển của team ở thời điểm này.</p>
                <p>Hồ sơ của bạn đã được lưu tự động vào hệ thống Talent Pool của chúng tôi. Chúng tôi sẽ ưu tiên liên hệ lại với bạn ngay khi có các vị trí mới phù hợp hơn trong tương lai.</p>
                
                <div class="button-container">
                    <a href="${process.env.NEXTAUTH_URL || 'https://phoenix-admin.vercel.app'}/careers" class="button" style="background-color: #64748b;">Khám phá các cơ hội khác</a>
                </div>
                
                <p>Chúc bạn thật nhiều rực rỡ và thành công trên con đường phát triển sự nghiệp sắp tới!</p>
                <br/>
                <p>Trân trọng,</p>
                <p><strong>Bộ phận Tuyển dụng Phoenix</strong></p>
            </div>
            <div class="footer">
                <p>Đây là email tự động. Vui lòng không trả lời.</p>
                <p>&copy; ${new Date().getFullYear()} Phoenix. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

export const getResetPasswordEmailTemplate = (userName: string, resetUrl: string) => {
    return `
<!DOCTYPE html>
<html>
<head><style>${BASE_EMAIL_STYLE}</style></head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <h2>Phoenix HRMS</h2>
            </div>
            <div class="content">
                <h3 style="color: #111827; margin-top: 0; font-size: 20px;">Yêu cầu Đặt lại mật khẩu</h3>
                <p>Xin chào <strong>${userName}</strong>,</p>
                <p>Chúng tôi vừa nhận được yêu cầu khôi phục mật khẩu truy cập hệ thống Phoenix HRMS được kết nối với địa chỉ email này.</p>
                <p>Vui lòng nhấp vào nút bên dưới để tiến hành thiết lập mật khẩu mới. Xin lưu ý rằng liên kết bảo mật này sẽ hết hạn sau <strong>1 giờ</strong>.</p>
                
                <div class="button-container">
                    <a href="${resetUrl}" class="button">Đặt Lại Mật Khẩu</a>
                </div>
                
                <p style="font-size: 14px; margin-top: 32px; color: #6b7280;">Nếu bạn không hề thực hiện yêu cầu này, xin vui lòng bỏ qua email. Tài khoản của bạn vẫn hoàn toàn an toàn và không có bất cứ thay đổi nào xảy ra.</p>
            </div>
            <div class="footer">
                <p>Đây là email hỗ trợ bảo mật tự động. Vui lòng không trả lời.</p>
                <p>&copy; ${new Date().getFullYear()} Phoenix. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

