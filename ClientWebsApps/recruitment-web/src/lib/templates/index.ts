export const getWelcomeEmailTemplate = (candidateName: string, jobTitle: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; background-color: #fff; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: #fff; text-decoration: none; border-radius: 4px; margin-top: 10px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #64748b; }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Hồ sơ ứng tuyển đã được tiếp nhận</h2>
        </div>
        <div class="content">
            <p>Xin chào <strong>${candidateName}</strong>,</p>
            <p>Cảm ơn bạn đã quan tâm và ứng tuyển vào vị trí <strong>${jobTitle}</strong> tại Phoenix Corp.</p>
            <p>Chúng tôi đã nhận được hồ sơ của bạn và sẽ tiến hành xem xét trong thời gian sớm nhất. Bộ phận tuyển dụng sẽ liên hệ với bạn nếu hồ sơ phù hợp.</p>
            <p>Trân trọng,</p>
            <p><strong>Bộ phận Tuyển dụng Phoenix Corp</strong></p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Phoenix Corp. All rights reserved.</p>
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
<head>
<style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f0fdf4; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; background-color: #fff; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #64748b; }
    .detail-box { background-color: #f8fafc; padding: 15px; border-radius: 4px; margin: 15px 0; }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Thư mời phỏng vấn</h2>
        </div>
        <div class="content">
            <p>Xin chào <strong>${candidateName}</strong>,</p>
            <p>Chúc mừng bạn đã vượt qua vòng sơ loại cho vị trí <strong>${jobTitle}</strong>.</p>
            <p>Chúng tôi trân trọng mời bạn tham gia buổi phỏng vấn tiếp theo với chi tiết như sau:</p>
            <div class="detail-box">
                <p><strong>Thời gian:</strong> ${date}</p>
                <p><strong>Hình thức:</strong> ${type}</p>
                ${location ? `<p><strong>Địa điểm:</strong> ${location}</p>` : ''}
                ${link ? `<p><strong>Link tham gia:</strong> <a href="${link}">${link}</a></p>` : ''}
            </div>
            <p>Vui lòng xác nhận tham gia bằng cách trả lời email này.</p>
            <p>Trân trọng,</p>
            <p><strong>Bộ phận Tuyển dụng Phoenix Corp</strong></p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Phoenix Corp. All rights reserved.</p>
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
<head>
<style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #eff6ff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; background-color: #fff; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #64748b; }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Thư mời nhận việc (Offer Letter)</h2>
        </div>
        <div class="content">
            <p>Xin chào <strong>${candidateName}</strong>,</p>
            <p>Chúng tôi rất vui mừng thông báo bạn đã trúng tuyển vị trí <strong>${jobTitle}</strong> tại Phoenix Corp!</p>
            <p>Dựa trên năng lực và kinh nghiệm của bạn, chúng tôi xin gửi đến bạn lời mời làm việc với các thông tin chính:</p>
            <ul>
                <li><strong>Mức lương cơ bản:</strong> ${salary} VND</li>
                <li><strong>Ngày bắt đầu làm việc (dự kiến):</strong> ${startDate}</li>
            </ul>
            <p>Chi tiết về các chế độ phúc lợi khác được đính kèm trong email này.</p>
            <p>Vui lòng phản hồi trước ngày hết hạn offer.</p>
            <p>Chúng tôi rất mong được chào đón bạn gia nhập đội ngũ Phoenix Corp!</p>
            <p>Trân trọng,</p>
            <p><strong>Bộ phận Nhân sự Phoenix Corp</strong></p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Phoenix Corp. All rights reserved.</p>
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
<head>
<style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #fef2f2; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; background-color: #fff; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #64748b; }
    .cta-box { background-color: #f8fafc; padding: 15px; border-radius: 4px; margin: 15px 0; text-align: center; }
    .cta-box a { color: #3b82f6; text-decoration: none; font-weight: bold; }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Thông báo kết quả ứng tuyển</h2>
        </div>
        <div class="content">
            <p>Xin chào <strong>${candidateName}</strong>,</p>
            <p>Cảm ơn bạn đã dành thời gian ứng tuyển vào vị trí <strong>${jobTitle}</strong> tại Phoenix Corp.</p>
            <p>Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn chưa phù hợp với yêu cầu của vị trí này tại thời điểm hiện tại.</p>
            <p>Chúng tôi đánh giá cao sự quan tâm của bạn đối với Phoenix Corp và khuyến khích bạn tiếp tục theo dõi các vị trí tuyển dụng khác phù hợp hơn.</p>
            <div class="cta-box">
                <p>Xem các vị trí đang tuyển tại:</p>
                <a href="${process.env.NEXTAUTH_URL || 'https://phoenix-admin.vercel.app'}/careers">Phoenix Careers</a>
            </div>
            <p>Chúc bạn nhiều thành công trong sự nghiệp!</p>
            <p>Trân trọng,</p>
            <p><strong>Bộ phận Tuyển dụng Phoenix Corp</strong></p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Phoenix Corp. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};
