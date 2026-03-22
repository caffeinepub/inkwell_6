import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Bookmark,
  Clock,
  Heart,
  Lock,
  Menu,
  MessageSquare,
  PenLine,
  Plus,
  Search,
  Star,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SORT_OPTIONS = [
  { label: "Most Recent", icon: Clock },
  { label: "Most Read", icon: TrendingUp },
  { label: "Most Comments", icon: MessageSquare },
  { label: "Your Favorites", icon: Heart },
];

type Story = {
  id: number;
  title: string;
  author: string;
  genre: string;
  excerpt: string;
  readTime: string;
  comments: number;
  hearts: number;
  reads: number;
  tags: string[];
  series?: string;
  seriesOrder?: number;
};

type PrivateComment = {
  id: number;
  authorName: string;
  message: string;
  timestamp: string;
  adminReply?: string;
};

type PublicComment = {
  id: number;
  authorName: string;
  message: string;
  timestamp: string;
};

const ADMIN_PASSWORD = "admin123";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("Most Recent");
  const [hearts, setHearts] = useState<Set<number>>(new Set());
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [stories, setStories] = useState<Story[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [signInError, setSignInError] = useState("");
  const [showAddStory, setShowAddStory] = useState(false);
  const [newStory, setNewStory] = useState({
    title: "",
    author: "",
    genre: "",
    excerpt: "",
    readTime: "",
    tags: "",
  });

  // Private Comments state
  const [privateComments, setPrivateComments] = useState<
    Record<number, PrivateComment[]>
  >({});
  const [showCommentsModal, setShowCommentsModal] = useState<number | null>(
    null,
  );
  const [privateCommentName, setPrivateCommentName] = useState("");
  const [privateCommentMessage, setPrivateCommentMessage] = useState("");
  const [viewingAsName, setViewingAsName] = useState("");
  const [viewNameInput, setViewNameInput] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");

  // Public Comments state
  const [publicComments, setPublicComments] = useState<
    Record<number, PublicComment[]>
  >({});
  const [publicCommentName, setPublicCommentName] = useState("");
  const [publicCommentMessage, setPublicCommentMessage] = useState("");

  const filteredSuggestions = stories
    .filter(
      (s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        searchQuery.length > 0,
    )
    .map((s) => s.title);

  const toggleHeart = (id: number) => {
    setHearts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSignIn = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowSignIn(false);
      setPasswordInput("");
      setSignInError("");
    } else {
      setSignInError("Incorrect password. Try again.");
    }
  };

  const handleSignOut = () => {
    setIsAdmin(false);
  };

  const handleAddStory = () => {
    if (!newStory.title.trim() || !newStory.excerpt.trim()) return;
    const story: Story = {
      id: Date.now(),
      title: newStory.title.trim(),
      author: newStory.author.trim() || "Admin",
      genre: newStory.genre.trim() || "General",
      excerpt: newStory.excerpt.trim(),
      readTime: newStory.readTime.trim() || "5 min",
      comments: 0,
      hearts: 0,
      reads: 0,
      tags: newStory.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    setStories((prev) => [story, ...prev]);
    setNewStory({
      title: "",
      author: "",
      genre: "",
      excerpt: "",
      readTime: "",
      tags: "",
    });
    setShowAddStory(false);
  };

  const handleDeleteStory = (id: number) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmitPrivateComment = (storyId: number) => {
    if (!privateCommentName.trim() || !privateCommentMessage.trim()) return;
    const comment: PrivateComment = {
      id: Date.now(),
      authorName: privateCommentName.trim(),
      message: privateCommentMessage.trim(),
      timestamp: new Date().toLocaleString(),
    };
    setPrivateComments((prev) => ({
      ...prev,
      [storyId]: [...(prev[storyId] ?? []), comment],
    }));
    setViewingAsName(privateCommentName.trim());
    setPrivateCommentMessage("");
  };

  const handleAdminReply = (storyId: number, commentId: number) => {
    if (!adminReplyText.trim()) return;
    setPrivateComments((prev) => ({
      ...prev,
      [storyId]: (prev[storyId] ?? []).map((c) =>
        c.id === commentId ? { ...c, adminReply: adminReplyText.trim() } : c,
      ),
    }));
    setReplyingToId(null);
    setAdminReplyText("");
  };

  const handleSubmitPublicComment = (storyId: number) => {
    if (!publicCommentName.trim() || !publicCommentMessage.trim()) return;
    const comment: PublicComment = {
      id: Date.now(),
      authorName: publicCommentName.trim(),
      message: publicCommentMessage.trim(),
      timestamp: new Date().toLocaleString(),
    };
    setPublicComments((prev) => ({
      ...prev,
      [storyId]: [...(prev[storyId] ?? []), comment],
    }));
    setPublicCommentName("");
    setPublicCommentMessage("");
  };

  const handleDeletePublicComment = (storyId: number, commentId: number) => {
    setPublicComments((prev) => ({
      ...prev,
      [storyId]: (prev[storyId] ?? []).filter((c) => c.id !== commentId),
    }));
  };

  const getPrivateCommentCount = (storyId: number) =>
    (privateComments[storyId] ?? []).length;

  const getPublicCommentCount = (storyId: number) =>
    (publicComments[storyId] ?? []).length;

  const getTotalCommentCount = (storyId: number) =>
    getPrivateCommentCount(storyId) + getPublicCommentCount(storyId);

  const closeCommentsModal = () => {
    setShowCommentsModal(null);
    setPrivateCommentName("");
    setPrivateCommentMessage("");
    setViewNameInput("");
    setViewingAsName("");
    setReplyingToId(null);
    setAdminReplyText("");
    setPublicCommentName("");
    setPublicCommentMessage("");
  };

  const activeStory = stories.find((s) => s.id === showCommentsModal);
  const storyPrivateComments = showCommentsModal
    ? (privateComments[showCommentsModal] ?? [])
    : [];
  const storyPublicComments = showCommentsModal
    ? (publicComments[showCommentsModal] ?? [])
    : [];
  const myPrivateComments = storyPrivateComments.filter(
    (c) => c.authorName.toLowerCase() === viewingAsName.toLowerCase(),
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ───────── HEADER ───────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo + Name */}
            <a
              href="/"
              className="flex items-center gap-3 flex-shrink-0 group"
              data-ocid="nav.link"
            >
              <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary/40 group-hover:ring-primary transition-all shadow-glow">
                <img
                  src="/assets/generated/story-reviews-logo-transparent.dim_400x400.png"
                  alt="Story Reviews Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground tracking-tight leading-none">
                Story
                <span className="text-primary"> Reviews</span>
              </span>
            </a>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search stories, authors..."
                  className="pl-9 bg-muted/50 border-border focus:bg-white transition-colors"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(e.target.value.length > 0);
                  }}
                  onFocus={() => setSearchOpen(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                  data-ocid="header.search_input"
                />
              </div>
              <AnimatePresence>
                {searchOpen && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 left-0 right-0 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    {filteredSuggestions.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/60 flex items-center gap-2 transition-colors"
                        onMouseDown={() => setSearchQuery(s)}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nav Actions */}
            <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" data-ocid="nav.primary_button">
                Browse
              </Button>
              <Button
                variant="ghost"
                size="sm"
                data-ocid="nav.secondary_button"
              >
                About
              </Button>
              {isAdmin ? (
                <>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setShowAddStory(true)}
                    data-ocid="nav.add_story_button"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Story
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    data-ocid="nav.signout_button"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setShowSignIn(true)}
                  data-ocid="nav.submit_button"
                >
                  Sign In
                </Button>
              )}
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              data-ocid="nav.toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search stories..."
                    className="pl-9 bg-muted/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-ocid="mobile.search_input"
                  />
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    data-ocid="mobile.nav.primary_button"
                  >
                    Browse
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    data-ocid="mobile.nav.secondary_button"
                  >
                    About
                  </Button>
                  {isAdmin ? (
                    <>
                      <Button
                        size="sm"
                        className="justify-start bg-primary text-primary-foreground"
                        onClick={() => {
                          setShowAddStory(true);
                          setMobileMenuOpen(false);
                        }}
                        data-ocid="mobile.nav.add_story_button"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Story
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="justify-start bg-primary text-primary-foreground"
                      onClick={() => {
                        setShowSignIn(true);
                        setMobileMenuOpen(false);
                      }}
                      data-ocid="mobile.nav.submit_button"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ───────── SIGN IN MODAL ───────── */}
      <AnimatePresence>
        {showSignIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowSignIn(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm"
            >
              <h2 className="font-serif text-xl font-semibold mb-1">
                Admin Sign In
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your admin password to continue.
              </p>
              <Input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                className="mb-3"
              />
              {signInError && (
                <p className="text-sm text-red-500 mb-3">{signInError}</p>
              )}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSignIn}>
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowSignIn(false);
                    setPasswordInput("");
                    setSignInError("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────── ADD STORY MODAL ───────── */}
      <AnimatePresence>
        {showAddStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddStory(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg my-auto"
            >
              <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                <PenLine className="w-5 h-5 text-primary" /> Add New Story
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Title *
                  </span>
                  <Input
                    placeholder="Story title"
                    value={newStory.title}
                    onChange={(e) =>
                      setNewStory((p) => ({ ...p, title: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Author
                  </span>
                  <Input
                    placeholder="Author name"
                    value={newStory.author}
                    onChange={(e) =>
                      setNewStory((p) => ({ ...p, author: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Genre
                    </span>
                    <Input
                      placeholder="e.g. Fantasy"
                      value={newStory.genre}
                      onChange={(e) =>
                        setNewStory((p) => ({ ...p, genre: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Read Time
                    </span>
                    <Input
                      placeholder="e.g. 10 min"
                      value={newStory.readTime}
                      onChange={(e) =>
                        setNewStory((p) => ({ ...p, readTime: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Excerpt *
                  </span>
                  <textarea
                    placeholder="Short description or opening excerpt..."
                    value={newStory.excerpt}
                    onChange={(e) =>
                      setNewStory((p) => ({ ...p, excerpt: e.target.value }))
                    }
                    className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Tags (comma-separated)
                  </span>
                  <Input
                    placeholder="e.g. Fantasy, Magic, Adventure"
                    value={newStory.tags}
                    onChange={(e) =>
                      setNewStory((p) => ({ ...p, tags: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <Button
                  className="flex-1"
                  onClick={handleAddStory}
                  disabled={!newStory.title.trim() || !newStory.excerpt.trim()}
                >
                  Publish Story
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddStory(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────── COMMENTS MODAL (Public + Private tabs) ───────── */}
      <AnimatePresence>
        {showCommentsModal !== null && activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeCommentsModal();
            }}
            data-ocid="comments.modal"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-foreground leading-tight">
                    Comments
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {activeStory.title}
                  </p>
                </div>
                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                  onClick={closeCommentsModal}
                  data-ocid="comments.close_button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Switcher */}
              <Tabs defaultValue="public" className="w-full">
                <TabsList className="w-full mb-5">
                  <TabsTrigger
                    value="public"
                    className="flex-1 gap-2"
                    data-ocid="comments.tab"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Public
                    {storyPublicComments.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0 h-4 ml-1"
                      >
                        {storyPublicComments.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="private"
                    className="flex-1 gap-2"
                    data-ocid="comments.tab"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Private
                    {storyPrivateComments.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0 h-4 ml-1"
                      >
                        {storyPrivateComments.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* ── PUBLIC TAB ── */}
                <TabsContent value="public" className="mt-0">
                  {/* Public comments list */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-5">
                    {storyPublicComments.length === 0 ? (
                      <div
                        className="text-center py-8"
                        data-ocid="comments.empty_state"
                      >
                        <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No public comments yet. Be the first!
                        </p>
                      </div>
                    ) : (
                      storyPublicComments.map((comment, idx) => (
                        <div
                          key={comment.id}
                          className="rounded-lg border border-border bg-muted/5 p-4 group"
                          data-ocid={`comments.item.${idx + 1}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-foreground">
                              {comment.authorName}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {comment.timestamp}
                              </span>
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeletePublicComment(
                                      showCommentsModal!,
                                      comment.id,
                                    )
                                  }
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-all"
                                  aria-label="Delete comment"
                                  data-ocid={`comments.delete_button.${idx + 1}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {comment.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Submit public comment form */}
                  <div className="border-t border-border pt-4 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Leave a public comment
                    </h3>
                    <Input
                      placeholder="Your name"
                      value={publicCommentName}
                      onChange={(e) => setPublicCommentName(e.target.value)}
                      data-ocid="comments.input"
                    />
                    <textarea
                      placeholder="Write a comment..."
                      value={publicCommentMessage}
                      onChange={(e) => setPublicCommentMessage(e.target.value)}
                      className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      data-ocid="comments.textarea"
                    />
                    <Button
                      className="w-full"
                      onClick={() =>
                        handleSubmitPublicComment(showCommentsModal!)
                      }
                      disabled={
                        !publicCommentName.trim() ||
                        !publicCommentMessage.trim()
                      }
                      data-ocid="comments.submit_button"
                    >
                      Post Comment
                    </Button>
                  </div>
                </TabsContent>

                {/* ── PRIVATE TAB ── */}
                <TabsContent value="private" className="mt-0">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      Private Comments
                    </span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {storyPrivateComments.length}{" "}
                      {storyPrivateComments.length === 1
                        ? "comment"
                        : "comments"}
                    </Badge>
                  </div>

                  {/* ── ADMIN VIEW ── */}
                  {isAdmin ? (
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                      {storyPrivateComments.length === 0 ? (
                        <div
                          className="text-center py-10"
                          data-ocid="comments.empty_state"
                        >
                          <Lock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No private comments yet.
                          </p>
                        </div>
                      ) : (
                        storyPrivateComments.map((comment, idx) => (
                          <div
                            key={comment.id}
                            className="rounded-lg border border-border bg-muted/5 p-4"
                            data-ocid={`comments.item.${idx + 1}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-foreground">
                                {comment.authorName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {comment.message}
                            </p>

                            {/* Admin reply section */}
                            {comment.adminReply ? (
                              <div className="mt-3 rounded-md bg-primary/10 border border-primary/20 px-3 py-2">
                                <p className="text-xs font-semibold text-primary mb-1">
                                  Your reply:
                                </p>
                                <p className="text-sm text-foreground/80">
                                  {comment.adminReply}
                                </p>
                              </div>
                            ) : replyingToId === comment.id ? (
                              <div className="mt-3 space-y-2">
                                <textarea
                                  placeholder="Write your reply..."
                                  value={adminReplyText}
                                  onChange={(e) =>
                                    setAdminReplyText(e.target.value)
                                  }
                                  className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                  data-ocid="comments.textarea"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={() =>
                                      handleAdminReply(
                                        showCommentsModal!,
                                        comment.id,
                                      )
                                    }
                                    disabled={!adminReplyText.trim()}
                                    data-ocid="comments.submit_button"
                                  >
                                    Send Reply
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setReplyingToId(null);
                                      setAdminReplyText("");
                                    }}
                                    data-ocid="comments.cancel_button"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 text-xs h-7 px-3"
                                onClick={() => {
                                  setReplyingToId(comment.id);
                                  setAdminReplyText("");
                                }}
                                data-ocid={`comments.edit_button.${idx + 1}`}
                              >
                                Reply
                              </Button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    /* ── NON-ADMIN VIEW ── */
                    <div className="space-y-5">
                      {!viewingAsName ? (
                        <div className="space-y-4">
                          {/* Submit new comment */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-foreground">
                              Leave a private comment
                            </h3>
                            <Input
                              placeholder="Your name"
                              value={privateCommentName}
                              onChange={(e) =>
                                setPrivateCommentName(e.target.value)
                              }
                              data-ocid="comments.input"
                            />
                            <textarea
                              placeholder="Your private comment..."
                              value={privateCommentMessage}
                              onChange={(e) =>
                                setPrivateCommentMessage(e.target.value)
                              }
                              className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30"
                              data-ocid="comments.textarea"
                            />
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Your comment is private and only visible to you
                              and the admin.
                            </p>
                            <Button
                              className="w-full"
                              onClick={() =>
                                handleSubmitPrivateComment(showCommentsModal!)
                              }
                              disabled={
                                !privateCommentName.trim() ||
                                !privateCommentMessage.trim()
                              }
                              data-ocid="comments.submit_button"
                            >
                              Submit Private Comment
                            </Button>
                          </div>

                          {/* View existing comments */}
                          <div className="border-t border-border pt-4 space-y-3">
                            <h3 className="text-sm font-semibold text-foreground">
                              View my existing comments
                            </h3>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Enter your name"
                                value={viewNameInput}
                                onChange={(e) =>
                                  setViewNameInput(e.target.value)
                                }
                                data-ocid="comments.search_input"
                              />
                              <Button
                                variant="outline"
                                onClick={() => {
                                  if (viewNameInput.trim())
                                    setViewingAsName(viewNameInput.trim());
                                }}
                                disabled={!viewNameInput.trim()}
                                data-ocid="comments.secondary_button"
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Showing this visitor's comments */
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              Showing comments by{" "}
                              <span className="font-semibold text-foreground">
                                {viewingAsName}
                              </span>
                            </p>
                            <button
                              type="button"
                              className="text-xs text-primary underline hover:no-underline"
                              onClick={() => {
                                setViewingAsName("");
                                setViewNameInput("");
                                setPrivateCommentName("");
                                setPrivateCommentMessage("");
                              }}
                            >
                              Switch name
                            </button>
                          </div>

                          {myPrivateComments.length === 0 ? (
                            <div
                              className="text-center py-8"
                              data-ocid="comments.empty_state"
                            >
                              <p className="text-sm text-muted-foreground">
                                No comments found for this name.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                              {myPrivateComments.map((comment, idx) => (
                                <div
                                  key={comment.id}
                                  className="rounded-lg border border-border bg-muted/5 p-4"
                                  data-ocid={`comments.item.${idx + 1}`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-primary">
                                      Your comment
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {comment.timestamp}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {comment.message}
                                  </p>
                                  {comment.adminReply && (
                                    <div className="mt-3 rounded-md bg-primary/10 border border-primary/20 px-3 py-2">
                                      <p className="text-xs font-semibold text-primary mb-1">
                                        Admin replied:
                                      </p>
                                      <p className="text-sm text-foreground/80">
                                        {comment.adminReply}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add another comment */}
                          <div className="border-t border-border pt-4 space-y-3">
                            <h3 className="text-sm font-semibold text-foreground">
                              Add another comment
                            </h3>
                            <textarea
                              placeholder="Your private comment..."
                              value={privateCommentMessage}
                              onChange={(e) =>
                                setPrivateCommentMessage(e.target.value)
                              }
                              className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30"
                              data-ocid="comments.textarea"
                            />
                            <Button
                              className="w-full"
                              onClick={() => {
                                if (!privateCommentMessage.trim()) return;
                                const comment: PrivateComment = {
                                  id: Date.now(),
                                  authorName: viewingAsName,
                                  message: privateCommentMessage.trim(),
                                  timestamp: new Date().toLocaleString(),
                                };
                                setPrivateComments((prev) => ({
                                  ...prev,
                                  [showCommentsModal!]: [
                                    ...(prev[showCommentsModal!] ?? []),
                                    comment,
                                  ],
                                }));
                                setPrivateCommentMessage("");
                              }}
                              disabled={!privateCommentMessage.trim()}
                              data-ocid="comments.submit_button"
                            >
                              Submit Private Comment
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────── HERO ───────── */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 border-b border-border py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
              Discover Stories Worth
              <span className="text-primary"> Reading</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Curated fiction and literary reviews -- from debut novellas to
              series sagas. Find your next favourite read.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ───────── SORT TABS ───────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
          {SORT_OPTIONS.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              onClick={() => setActiveSort(label)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                activeSort === label
                  ? "bg-primary text-primary-foreground border-primary shadow-glow"
                  : "bg-white border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
              data-ocid="stories.filter.tab"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* ───────── STORY GRID ───────── */}
        {stories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="stories.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-primary/60" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              No stories yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              {isAdmin
                ? 'Click "Add Story" in the header to publish your first story.'
                : "Check back soon -- new stories are on the way."}
            </p>
            {isAdmin && (
              <Button className="mt-5" onClick={() => setShowAddStory(true)}>
                <Plus className="w-4 h-4 mr-1.5" /> Add Your First Story
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, idx) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="bg-white rounded-xl border border-border shadow-xs hover:shadow-md hover:border-primary/40 transition-all group flex flex-col"
                data-ocid={`stories.item.${idx + 1}`}
              >
                {/* Card top */}
                <div className="relative p-5 flex-1">
                  {story.series && (
                    <Badge
                      variant="secondary"
                      className="mb-3 text-xs font-medium"
                    >
                      Series · #{story.seriesOrder}
                    </Badge>
                  )}
                  <h2 className="font-serif text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors leading-snug">
                    {story.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mb-3">
                    by{" "}
                    <span className="font-medium text-foreground/80">
                      {story.author}
                    </span>
                    <span className="mx-1.5">·</span>
                    <span>{story.readTime} read</span>
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {story.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {story.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs px-2 py-0.5 border-primary/30 text-primary/80"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(story.id)}
                      className="absolute top-3 right-3 p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Delete story"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Card footer */}
                <div className="border-t border-border px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {story.reads.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {story.comments + getTotalCommentCount(story.id)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleHeart(story.id)}
                      className={`p-1.5 rounded-md transition-colors ${
                        hearts.has(story.id)
                          ? "text-red-500"
                          : "text-muted-foreground hover:text-red-400"
                      }`}
                      data-ocid={`stories.toggle.${idx + 1}`}
                      aria-label="Heart story"
                    >
                      <Heart
                        className={`w-4 h-4 ${hearts.has(story.id) ? "fill-current" : ""}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(story.id)}
                      className={`p-1.5 rounded-md transition-colors ${
                        bookmarks.has(story.id)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                      data-ocid={`stories.secondary_button.${idx + 1}`}
                      aria-label="Bookmark story"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${bookmarks.has(story.id) ? "fill-current" : ""}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCommentsModal(story.id)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary transition-colors relative"
                      aria-label="Comments"
                      data-ocid={`comments.open_modal_button.${idx + 1}`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      {getTotalCommentCount(story.id) > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                          {getTotalCommentCount(story.id)}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Review Stars CTA */}
        {!isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2.5 text-sm text-primary font-medium">
              <Star className="w-4 h-4 fill-primary" />
              Sign in to leave reviews and track your reading history
            </div>
          </motion.div>
        )}
      </main>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-border bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/generated/story-reviews-logo-transparent.dim_400x400.png"
              alt="Story Reviews"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-primary/30"
            />
            <span className="font-serif text-sm font-semibold text-foreground">
              Story Reviews
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}. Built with &hearts; using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
