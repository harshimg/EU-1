
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import fitz
import math
import io

ALPHA_URL = "https://alpharesult.in"
LOGO_PATH = "app/assets/ar_logo_bg-free.png"


def is_scanned_page(page):
    return len(page.get_text().strip()) == 0


#----To add logo and watermark in scanned pdf
def watermark_scanned_page(page, logo_path):
    # pix = page.get_pixmap(dpi=300)
    pix = page.get_pixmap(dpi=200)
    base = Image.frombytes("RGB", [pix.width, pix.height], pix.samples).convert("RGBA")

    w, h = base.size

    # Master overlay
    overlay = Image.new("RGBA", (w, h), (255, 255, 255, 0))

    # ── 1️⃣ LOGO (BLENDED, BUT VISIBLE) ──
    logo = Image.open(logo_path).convert("RGBA")

    logo_width = int(w * 0.38)
    ratio = logo_width / logo.width
    logo_height = int(logo.height * ratio)
    logo = logo.resize((logo_width, logo_height))

    # 🔥 FIX: increase effective opacity
    alpha = logo.split()[-1]
    alpha = ImageEnhance.Brightness(alpha).enhance(0.65)  # ← WAS 0.18 (too low)
    logo.putalpha(alpha)

    logo_layer = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    logo_x = (w - logo_width) // 2
    logo_y = int(h * 0.22)   # 👈 upper area, not center

    logo_layer.paste(logo, (logo_x, logo_y), logo)

    overlay = Image.alpha_composite(overlay, logo_layer)

    # ── 2️⃣ DIAGONAL TEXT (UNCHANGED, WORKING) ──
    text_layer = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    text_draw = ImageDraw.Draw(text_layer)

    watermark_text = "alpharesult.in"
    font_size = int(w * 0.16)

    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()

    text_draw.text(
        (w * 0.05, h * 0.4),
        watermark_text,
        fill=(40, 90, 160, 35),
        font=font
    )

    text_layer = text_layer.rotate(45, resample=Image.BICUBIC, expand=False)
    overlay = Image.alpha_composite(overlay, text_layer)

    # ── 3️⃣ FOOTER (DRAW ON ITS OWN LAYER) ──
    footer_layer = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    footer_draw = ImageDraw.Draw(footer_layer)

    footer_text = "Click here for PYQ & Solutions – alpharesult.in"
    footer_font_size = int(w * 0.022)

    try:
        footer_font = ImageFont.truetype("arial.ttf", footer_font_size)
    except:
        footer_font = ImageFont.load_default()

    footer_width = int(footer_draw.textlength(footer_text, font=footer_font))

    footer_draw.text(
        ((w - footer_width) / 2, h - footer_font_size * 2),
        footer_text,
        fill=(30, 80, 150, 160) ,  # stronger so readable on scan
        font=footer_font
    )

    overlay = Image.alpha_composite(overlay, footer_layer)

    # ── 4️⃣ FINAL MERGE ──
    final_img = Image.alpha_composite(base, overlay).convert("RGB")
    return final_img



#------To add header in digital PDF------------#
HEADER_HEIGHT = 60

def add_alpharesult_header(page):
    rect = page.rect

    # ── HEADER BACKGROUND ──
    page.draw_rect(
        fitz.Rect(0, 0, rect.width, HEADER_HEIGHT),
        color=None,
        fill=(0.80, 0.92, 0.97)
    )

    # ── LOGO (BIGGER, CENTERED VERTICALLY) ──
    logo_height = 88
    logo_width = 88  # square works well for your logo
    logo_y = (HEADER_HEIGHT - logo_height) / 2

    logo_rect = fitz.Rect(
        15,
        logo_y,
        15 + logo_width,
        logo_y + logo_height
    )

    page.insert_image(
        logo_rect,
        filename=LOGO_PATH,
        keep_proportion=True
    )

    # ── TITLE (HORIZONTALLY CENTERED) ──
    title_text = "ALPHA RESULT"
    title_fontsize = 20

    title_width = fitz.get_text_length(title_text, fontsize=title_fontsize)

    title_x = (rect.width - title_width) / 2
    title_y = 36  # visually centered in header

    page.insert_text(
        (title_x, title_y),
        title_text,
        fontsize=title_fontsize,
        color=(0.05, 0.15, 0.35)
    )

    # ── SOCIAL LINKS (BOTTOM ROW) ──
    links = [
        ("WhatsApp", "https://whatsapp.com/channel/0029VbBtQTgB4hdbSEAEY52G"),
        ("YouTube", "https://www.youtube.com/@alpharesult"),
        ("Telegram", "https://t.me/alpha_result"),
        ("LinkedIn", "https://www.linkedin.com/company/alpharesult"),
        ("Email", "mailto:alpharesult@gmail.com"),
        ("Website", "https://alpharesult.in"),
    ]

    start_x = 80
    y = 52
    gap = 80

    x = start_x
    for text, url in links:
        page.insert_text(
            (x, y),
            text,
            fontsize=9,
            color=(0.1, 0.4, 0.8)
        )

        text_width = fitz.get_text_length(text, fontsize=9)

        page.insert_link({
            "kind": fitz.LINK_URI,
            "from": fitz.Rect(
                x,
                y - 10,
                x + text_width,
                y + 2
            ),
            "uri": url
        })

        x += gap




#-------To add logo and watermark in digital pdf-------#
def watermark_digital_page(page):
    rect = page.rect

    # 1️⃣ FULL PAGE CLICKABLE LINK
    page.insert_link({
        "kind": fitz.LINK_URI,
        # "from": rect,/
        "from": fitz.Rect(
        0,
        HEADER_HEIGHT,
        page.rect.width,
        page.rect.height
    ),
        "uri": "https://alpharesult.in"
    })

    # 2️⃣ LOGO (VERY LIGHT, UPPER AREA)
    logo_rect = fitz.Rect(
    rect.width * 0.34,
    rect.height * 0.30,   # 🔽 moved down (was 0.12)
    rect.width * 0.66,
    rect.height * 0.60   # 🔽 balanced height
    )

    page.insert_image(
        logo_rect,
        filename=LOGO_PATH,
        keep_proportion=True,
        overlay=True   # unavoidable for digital PDFs
    )

    # 3️⃣ DIAGONAL TEXT (LIGHT BLUE, LARGE)
    tw = fitz.TextWriter(rect)

    tw.append(
        fitz.Point(rect.width * 0.04, rect.height * 0.65),
        "alpharesult.in",
        fontsize=64
    )

    matrix = fitz.Matrix(1, 1).prerotate(45)

    tw.write_text(
        page,
        color=(0.82, 0.88, 0.96),  # VERY light blue
        morph=(fitz.Point(rect.width / 2, rect.height / 2), matrix),
        overlay=True
    )

    # 4️⃣ FOOTER (SUBTLE BLUE)
    page.insert_text(
        (rect.width * 0.28, rect.height - 22),
        "Click here for PYQ & Solutions – alpharesult.in",
        fontsize=9,
        color=(0.35, 0.55, 0.85)
    )




def process_pdf(input_pdf_path: str, output_pdf_path: str):
    doc = fitz.open(input_pdf_path)
    new_doc = fitz.open()

    for page in doc:
        if is_scanned_page(page):
            # 🟢 IMAGE-BLENDED WATERMARK
            final_img = watermark_scanned_page(page, LOGO_PATH)

            buf = io.BytesIO()
            # final_img.save(buf, format="JPEG", quality=90, subsampling=0)
            final_img.save(
                buf,
                format="JPEG",
                quality=80,
                subsampling=2,
                optimize=True
            )
            img_bytes = buf.getvalue()
            buf.close()

            new_page = new_doc.new_page(
                width=page.rect.width,
                height=page.rect.height
            )

            new_page.insert_image(new_page.rect, stream=img_bytes)

            # 🔗 CLICK ANYWHERE → alpharesult.in
            new_page.insert_link({
                "kind": fitz.LINK_URI,
                "from": new_page.rect,
                "uri": "https://alpharesult.in"
            })


        else:
            # 🟢 DIGITAL PDF → use existing logic
            # new_doc.insert_pdf(doc, from_page=page.number, to_page=page.number)
            new_doc.insert_pdf(doc, from_page=page.number, to_page=page.number)
            new_page = new_doc[-1]  # last inserted page

            add_alpharesult_header(new_page)
            watermark_digital_page(new_page)


    new_doc.save(output_pdf_path)
    doc.close()
    new_doc.close()


