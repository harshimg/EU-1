export const handleShare = async () => {
    const url = window.location.href;
  
    // ✅ Mobile (native share)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AlphaResult PYQ",
          text: "Check this PYQ on AlphaResult",
          url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // ✅ Desktop fallback → copy link
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };