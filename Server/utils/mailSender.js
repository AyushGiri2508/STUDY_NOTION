const mailSender = async (email, title, body) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME || "StudyNotion",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email }],
        subject: title,
        htmlContent: body,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("❌ Brevo API error:", data);
      throw new Error(data.message || "Brevo email failed");
    }

    console.log("✅ Email sent via Brevo:", data.messageId);
    return data;
  } catch (error) {
    console.log("❌ Mail error:", error.message);
    throw error;
  }
};

module.exports = mailSender;
