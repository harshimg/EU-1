type ShareOptions = {
  title?: string;
  text?: string;
};

export const handleShare = async (options?: ShareOptions) => {
  const url = window.location.href;

  const title = options?.title || "AlphaResult";
  const text = options?.text || "Check this on AlphaResult";

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (err) {
      console.log("Share cancelled");
    }
  } else {
    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  }
};