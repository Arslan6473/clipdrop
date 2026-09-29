import type { ToolPageContent } from "./types";

const DEFAULT_NOTICE =
  "Only download videos you own, have permission to download, or that are licensed for downloading. ClipDrop doesn't bypass DRM, logins, private-content settings or other platform access controls.";

export const TOOL_PAGES = {
  youtube: {
    path: "/youtube-downloader",
    name: "YouTube Downloader",
    platform: "youtube",
    meta: {
      title: "YouTube Video Downloader",
      description:
        "Analyze YouTube video links with ClipDrop's free YouTube video downloader. See video details and available formats for content you own or are authorized to download.",
      keywords: ["youtube downloader", "youtube video downloader", "youtube video download"],
    },
    hero: {
      eyebrow: "YouTube",
      title: "YouTube Video Downloader",
      description:
        "Paste a YouTube link to see the video's details and any download options available for it.",
    },
    inputPlaceholder: "Paste YouTube URL",
    availability: {
      title: "What's available for YouTube",
      body: "ClipDrop recognizes public YouTube videos and Shorts and shows their title, channel and thumbnail. YouTube doesn't provide a download mechanism for third-party tools, so download options currently won't appear for YouTube links. To save your own uploads, use YouTube Studio's download option; for offline viewing, use YouTube's official apps where offered.",
    },
    supportedUrls: [
      { label: "Standard video", example: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" },
      { label: "Short link", example: "https://youtu.be/aqz-KE-bpKQ" },
      { label: "Shorts", example: "https://www.youtube.com/shorts/VIDEO_ID" },
      { label: "Embed", example: "https://www.youtube.com/embed/VIDEO_ID" },
    ],
    features: [
      { title: "Every YouTube link format", description: "Watch pages, youtu.be short links, Shorts, live and embed URLs are all recognized." },
      { title: "Clear video details", description: "Confirm you've got the right video with its title, channel and thumbnail before doing anything else." },
      { title: "Honest availability", description: "We only list formats a source actually provides. No fake quality options, ever." },
    ],
    why: {
      title: "Why use ClipDrop for YouTube links",
      body: "Most YouTube downloader sites are cluttered with ads and pop-ups and make promises they can't keep. ClipDrop keeps it simple: paste a link, see exactly what's available, and get clear guidance on the official options when a download isn't offered.",
    },
    faqs: [
      {
        question: "Can I download any YouTube video with ClipDrop?",
        answer:
          "No. YouTube's terms don't allow third-party downloading, and YouTube offers no download mechanism for tools like ClipDrop. We'll identify the video and tell you what's available — and we never bypass YouTube's restrictions.",
      },
      {
        question: "How can I download my own YouTube videos?",
        answer:
          "Open YouTube Studio, go to Content, and choose Download from the options menu next to your video. That gives you an MP4 of your own upload.",
      },
      {
        question: "Do YouTube Shorts links work?",
        answer: "Yes. Shorts links are recognized the same way as regular watch links.",
      },
      {
        question: "Do I need an account?",
        answer: "No. ClipDrop has no accounts, logins or signups. Just paste a link.",
      },
    ],
    related: ["/universal-video-downloader", "/video-to-mp4", "/tiktok-downloader", "/instagram-downloader"],
    notice: DEFAULT_NOTICE,
  },

  instagram: {
    path: "/instagram-downloader",
    name: "Instagram Downloader",
    platform: "instagram",
    meta: {
      title: "Instagram Video Downloader",
      description:
        "ClipDrop's Instagram video downloader checks public Instagram post and Reels links and shows what's available to download. No login, no signup.",
      keywords: ["instagram downloader", "instagram video downloader", "instagram reels downloader", "download instagram video"],
    },
    hero: {
      eyebrow: "Instagram",
      title: "Instagram Video Downloader",
      description:
        "Paste a public Instagram post or Reel link to see its details and any download options available for content you're allowed to save.",
    },
    inputPlaceholder: "Paste Instagram post or Reel URL",
    availability: {
      title: "What's available for Instagram",
      body: "ClipDrop recognizes public Instagram post and Reel links. Instagram doesn't offer a download mechanism for third-party tools, and private or login-only posts are never supported. To download your own posts and Reels, use Instagram's “Download your information” tool in Accounts Center.",
    },
    supportedUrls: [
      { label: "Reel", example: "https://www.instagram.com/reel/SHORTCODE/" },
      { label: "Post", example: "https://www.instagram.com/p/SHORTCODE/" },
      { label: "IGTV", example: "https://www.instagram.com/tv/SHORTCODE/" },
    ],
    features: [
      { title: "Reels and posts", description: "Works as an Instagram Reels downloader check and for regular video posts." },
      { title: "No Instagram login", description: "We never ask for your Instagram password or connect to your account." },
      { title: "Clean links", description: "Tracking parameters like igsh are stripped automatically before we analyze a link." },
    ],
    why: {
      title: "A cleaner Instagram downloader online",
      body: "Many Instagram downloader tools ask for your login or bury the page in ads. ClipDrop never touches your account, keeps nothing after your request, and is upfront about what Instagram does and doesn't allow.",
    },
    faqs: [
      {
        question: "Can I download private Instagram videos?",
        answer: "No. Private and login-protected content isn't supported, and we'll never ask for your Instagram credentials.",
      },
      {
        question: "How do I download my own Instagram Reels?",
        answer:
          "In the Instagram app, go to Accounts Center → Your information and permissions → Download your information. Instagram will prepare a copy of your media.",
      },
      {
        question: "Is my link stored?",
        answer: "No. Links are used only to process your request and aren't saved to any history or database.",
      },
    ],
    related: ["/facebook-downloader", "/tiktok-downloader", "/universal-video-downloader", "/youtube-downloader"],
    notice: DEFAULT_NOTICE,
  },

  tiktok: {
    path: "/tiktok-downloader",
    name: "TikTok Downloader",
    platform: "tiktok",
    meta: {
      title: "TikTok Video Downloader",
      description:
        "Use ClipDrop's TikTok video downloader to check public TikTok links, see video details and find the download options that are actually available.",
      keywords: ["tiktok downloader", "tiktok video downloader", "download tiktok video"],
    },
    hero: {
      eyebrow: "TikTok",
      title: "TikTok Video Downloader",
      description: "Paste a public TikTok video link to see its details and the download options available for it.",
    },
    inputPlaceholder: "Paste TikTok video URL",
    availability: {
      title: "What's available for TikTok",
      body: "ClipDrop recognizes public TikTok videos, including vm.tiktok.com share links, and shows their caption, creator and thumbnail. TikTok doesn't provide downloads to third-party tools, so download options won't currently appear. Creators can let viewers save their videos in the TikTok app — look for “Save video” in the share menu. ClipDrop doesn't alter videos or remove watermarks.",
    },
    supportedUrls: [
      { label: "Video page", example: "https://www.tiktok.com/@creator/video/7234567890123456789" },
      { label: "Share link", example: "https://vm.tiktok.com/ZMabc123/" },
      { label: "Short link", example: "https://www.tiktok.com/t/ZTabc123/" },
    ],
    features: [
      { title: "Share links welcome", description: "Links copied from the TikTok app's share sheet are recognized, no cleanup needed." },
      { title: "Creator details", description: "See the caption, creator and thumbnail to confirm you've got the right video." },
      { title: "Works on your phone", description: "Designed for one-handed use: copy in TikTok, paste in your browser, done." },
    ],
    why: {
      title: "Why ClipDrop for TikTok",
      body: "A TikTok downloader should be quick and honest. ClipDrop gives you a clear answer about what's available for each video, without pop-ups, fake buttons or sign-up walls.",
    },
    faqs: [
      {
        question: "Does ClipDrop remove TikTok watermarks?",
        answer: "No. ClipDrop never modifies videos, and removing a watermark isn't something we offer.",
      },
      {
        question: "How can I save a TikTok video legitimately?",
        answer:
          "If the creator allows it, tap Share → Save video in the TikTok app. You can also download your own videos from TikTok's “Download your data” settings.",
      },
      {
        question: "Why doesn't a download option appear?",
        answer:
          "TikTok doesn't give third-party tools a way to download videos. When a platform offers no authorized download mechanism, we say so rather than work around it.",
      },
    ],
    related: ["/instagram-downloader", "/youtube-downloader", "/universal-video-downloader", "/facebook-downloader"],
    notice: DEFAULT_NOTICE,
  },

  facebook: {
    path: "/facebook-downloader",
    name: "Facebook Downloader",
    platform: "facebook",
    meta: {
      title: "Facebook Video Downloader",
      description:
        "Check public Facebook video and Reels links with ClipDrop's Facebook video downloader and see which download options are available. Free, no account needed.",
      keywords: ["facebook downloader", "facebook video downloader", "facebook reels downloader"],
    },
    hero: {
      eyebrow: "Facebook",
      title: "Facebook Video Downloader",
      description: "Paste a public Facebook video or Reel link to see what's available for content you're permitted to save.",
    },
    inputPlaceholder: "Paste Facebook video or Reel URL",
    availability: {
      title: "What's available for Facebook",
      body: "ClipDrop recognizes public Facebook video, Watch and Reels links. Facebook doesn't offer a download mechanism to third-party tools, and private, friends-only or group content is never supported. To save your own videos, use Facebook's “Download your information” tool in Accounts Center.",
    },
    supportedUrls: [
      { label: "Page video", example: "https://www.facebook.com/PageName/videos/1234567890/" },
      { label: "Watch", example: "https://www.facebook.com/watch/?v=1234567890" },
      { label: "Reel", example: "https://www.facebook.com/reel/1234567890" },
      { label: "Short link", example: "https://fb.watch/abc123/" },
    ],
    features: [
      { title: "Videos and Reels", description: "Handles Page videos, Watch links, Reels, share links and fb.watch short links." },
      { title: "Never asks for a login", description: "We don't connect to your Facebook account or request your password." },
      { title: "Public content only", description: "Private and friends-only videos stay private. We don't work around privacy settings." },
    ],
    why: {
      title: "A straightforward Facebook video downloader",
      body: "ClipDrop tells you plainly what's possible for a Facebook video, keeps no record of the links you check, and points you to Facebook's official tools for your own content.",
    },
    faqs: [
      {
        question: "Can I download videos from private groups?",
        answer: "No. Content that requires a login, including private groups and friends-only posts, isn't supported.",
      },
      {
        question: "How do I download my own Facebook videos?",
        answer:
          "Go to Settings → Accounts Center → Your information and permissions → Download your information, and select your posts and videos.",
      },
      {
        question: "Do fb.watch links work?",
        answer: "Yes. fb.watch short links and /share/v/ links are recognized.",
      },
    ],
    related: ["/instagram-downloader", "/tiktok-downloader", "/universal-video-downloader", "/video-to-mp4"],
    notice: DEFAULT_NOTICE,
  },




  universal: {
    path: "/universal-video-downloader",
    name: "Universal Downloader",
    meta: {
      title: "Online Video Downloader",
      description:
        "A free online video downloader that detects the platform automatically. Paste a supported link or a direct video file URL and see the available download options.",
      keywords: ["online video downloader", "video downloader online", "video downloader", "download video", "video download tool"],
    },
    hero: {
      eyebrow: "Universal",
      title: "Online Video Downloader",
      description: "Paste a supported video URL and we'll identify the platform and available download options.",
    },
    inputPlaceholder: "Paste any supported video URL",
    availability: {
      title: "What the universal downloader supports",
      body: "Paste a link from YouTube, Instagram, TikTok or Facebook and ClipDrop detects the platform automatically. You can also paste a direct link to a publicly hosted video file (.mp4, .webm, .mov, .m4v or .ogv) — for example from a public-domain archive or your own storage — and download it straight from its host. What's downloadable depends on each platform's rules.",
    },
    supportedUrls: [
      { label: "Direct video file", example: "https://example.org/videos/public-domain-film.mp4" },
      { label: "TikTok", example: "https://www.tiktok.com/@creator/video/7234567890123456789" },
      { label: "YouTube", example: "https://youtu.be/VIDEO_ID" },
      { label: "Any supported platform", example: "Instagram and Facebook links" },
    ],
    features: [
      { title: "Automatic detection", description: "No need to pick a platform first. Paste a link and ClipDrop works out the source." },
      { title: "Direct file links", description: "Public .mp4, .webm and .mov links show their real size and download from the original host." },
      { title: "Safe by design", description: "Links to private networks, local addresses and unsafe hosts are rejected automatically." },
    ],
    why: {
      title: "One online video downloader for everything",
      body: "Instead of bookmarking a different video download tool for every site, use one that detects the source and tells you clearly what's available.",
    },
    faqs: [
      {
        question: "Which sites does the online video downloader support?",
        answer:
          "YouTube, Instagram, TikTok and Facebook links are recognized, plus direct links to public video files. Download availability depends on each platform.",
      },
      {
        question: "What's a direct video file link?",
        answer:
          "A URL that points straight at a video file, usually ending in .mp4, .webm or .mov. Many public-domain archives and file hosts provide these.",
      },
      {
        question: "Is there a file size limit?",
        answer: "Files download straight from their original host to your device, so ClipDrop doesn't impose a size limit.",
      },
    ],
    related: ["/video-to-mp4", "/youtube-downloader", "/instagram-downloader", "/tiktok-downloader"],
    notice: DEFAULT_NOTICE,
  },

  mp4: {
    path: "/video-to-mp4",
    name: "Video to MP4",
    meta: {
      title: "Video to MP4 Downloader",
      description:
        "Save videos as MP4 when the source provides an MP4 file. Learn how MP4 availability works and download permitted videos with ClipDrop.",
      keywords: ["video to mp4", "download video as mp4", "mp4 video downloader"],
    },
    hero: {
      eyebrow: "MP4",
      title: "Video to MP4",
      description:
        "Get an MP4 file when the source makes one available. Paste a link and we'll show every format the source offers, MP4 included.",
    },
    inputPlaceholder: "Paste video URL",
    availability: {
      title: "How MP4 availability works",
      body: "ClipDrop doesn't re-encode or convert videos on our servers. Instead, we show the formats a source actually provides — and MP4 is the most common. Most direct video file links are MP4. If a source only offers another format, that's what you'll see listed.",
    },
    supportedUrls: [
      { label: "Direct MP4 file", example: "https://example.org/videos/lecture.mp4" },
      { label: "YouTube", example: "https://www.youtube.com/watch?v=VIDEO_ID" },
    ],
    features: [
      { title: "Original quality", description: "No re-encoding means no quality loss. You get the file exactly as published." },
      { title: "Format shown upfront", description: "Every download option is labelled with its container, so you know it's MP4 before downloading." },
      { title: "Plays everywhere", description: "MP4 works on phones, laptops, TVs and in every major video editor." },
    ],
    why: {
      title: "Why MP4?",
      body: "MP4 (H.264/AAC) is the most widely supported video format. It plays natively on iOS, Android, Windows, macOS and smart TVs, and imports cleanly into editing apps.",
    },
    extra: {
      title: "Why we don't “convert” videos",
      paragraphs: [
        "Many sites advertise one-click conversion to MP4. In practice, that means downloading a video from a platform without permission and re-encoding it, which lowers quality and often breaks the platform's terms.",
        "ClipDrop takes a simpler approach: we show the files a source officially provides. If an MP4 is available, you'll see it. If you need a different format for a file you own, a free desktop tool such as HandBrake can convert it locally on your computer.",
      ],
    },
    faqs: [
      {
        question: "Can ClipDrop convert any video to MP4?",
        answer:
          "No. We don't run conversions. We list the formats the source provides, and MP4 is available whenever the source offers it.",
      },
      {
        question: "Will the MP4 have audio?",
        answer: "Video formats include audio, and typical direct MP4 files do too. The format card shows what the source provides.",
      },
      {
        question: "How do I convert a video I already own?",
        answer: "Use a local tool such as HandBrake or your operating system's built-in export options.",
      },
    ],
    related: ["/universal-video-downloader", "/youtube-downloader", "/tiktok-downloader", "/facebook-downloader"],
    notice: DEFAULT_NOTICE,
  },
} satisfies Record<string, ToolPageContent>;

export type ToolPageKey = keyof typeof TOOL_PAGES;

export const TOOL_PAGE_LIST: ToolPageContent[] = Object.values(TOOL_PAGES);

export function toolPageByPath(path: string): ToolPageContent | undefined {
  return TOOL_PAGE_LIST.find((p) => p.path === path);
}
