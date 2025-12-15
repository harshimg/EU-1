from operator import truediv
import smtplib
from email.mime.text import MIMEText
from email.message import EmailMessage
from app.config import settings

def send_otp_email(to_email: str, otp: str):
    # msg = MIMEText(f"Your OTP for alpha result Study Platform is: {otp}")
    msg = EmailMessage()
    msg['Subject'] = "alpha result Study Platform - Email Verification OTP"
    msg['From'] = settings.SMTP_EMAIL
    msg['To'] = to_email
    msg.set_content(
        f"""
Hello,

Your verification code is:

    {otp}

This OTP is valid for only a few minutes.

If you did not request this, please ignore this email.

- Alpha result
"""
    )

    try:
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()

        print("OTP Email Sent")
        return True

    except Exception as e:
        print("Email Error:", e)
        return False
