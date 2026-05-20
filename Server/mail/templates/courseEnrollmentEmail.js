exports.courseEnrollmentEmail = (courseName, name) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>StudyNotion - Course Enrollment Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000814; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #000814; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellspacing="0" cellpadding="0" style="max-width: 520px; width: 100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #FFD60A; border-radius: 8px; padding: 8px 12px;">
                    <span style="font-size: 18px; font-weight: 800; color: #000814;">📚</span>
                  </td>
                  <td style="padding-left: 10px;">
                    <span style="font-size: 24px; font-weight: 800; color: #f1f5f9;">Study</span><span style="font-size: 24px; font-weight: 800; color: #FFD60A;">Notion</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background: linear-gradient(135deg, #0a1128 0%, #0f172a 100%); border: 1px solid rgba(71, 165, 255, 0.15); border-radius: 16px; padding: 40px 36px;">

              <!-- Heading -->
              <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #f1f5f9; text-align: center;">
                You're Enrolled! 🎉
              </h1>
              <p style="margin: 0 0 28px 0; font-size: 15px; color: #94a3b8; text-align: center; line-height: 1.6;">
                Dear <strong style="color: #f1f5f9;">${name}</strong>, your course registration was successful.
              </p>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid rgba(71, 165, 255, 0.1); margin: 0 0 28px 0;" />

              <!-- Course Highlight Box -->
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #94a3b8; text-align: center;">
                You have successfully registered for:
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <div style="background: rgba(255, 214, 10, 0.06); border: 2px solid rgba(255, 214, 10, 0.25); border-radius: 12px; padding: 20px 32px; display: inline-block;">
                      <span style="font-size: 20px; font-weight: 800; color: #FFD60A; letter-spacing: 0.5px;">
                        ${courseName}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 28px 0; font-size: 13px; color: #64748b; text-align: center;">
                🚀 Log in to your dashboard to start learning right away
              </p>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid rgba(71, 165, 255, 0.1); margin: 0 0 28px 0;" />

              <!-- What's Next Section -->
              <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #f1f5f9;">
                What happens next?
              </h3>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 8px;">
                <tr>
                  <td style="padding: 6px 12px 6px 0; vertical-align: top;">
                    <span style="color: #FFD60A; font-size: 16px;">✓</span>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                    Log in to your StudyNotion dashboard to access your course materials
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px 6px 0; vertical-align: top;">
                    <span style="color: #FFD60A; font-size: 16px;">✓</span>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                    Watch video lectures and download companion PDFs at your own pace
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px 6px 0; vertical-align: top;">
                    <span style="color: #FFD60A; font-size: 16px;">✓</span>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                    Earn your certificate of completion once you finish the course
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 0; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #475569;">
                If you didn't purchase this course, please contact us immediately.
              </p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #475569;">
                Need help? Contact us at <a href="mailto:support@studynotion.com" style="color: #47A5FF; text-decoration: none;">support@studynotion.com</a>
              </p>
              <p style="margin: 16px 0 0 0; font-size: 11px; color: #334155;">
                © ${new Date().getFullYear()} StudyNotion. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
