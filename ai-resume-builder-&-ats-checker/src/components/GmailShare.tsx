import React, { useState, useEffect } from "react";
import { ResumeData } from "../types";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  LogOut, 
  UserCheck, 
  Sparkles
} from "lucide-react";
import { googleSignIn, initAuth, logout as firebaseLogout } from "../lib/firebaseAuth";

interface GmailShareProps {
  resumeData: ResumeData;
  theme: "dark" | "light";
}

export default function GmailShare({ resumeData, theme }: GmailShareProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ email?: string; name?: string; picture?: string } | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Email form state
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState(`Professional Resume - ${resumeData.fullName}`);
  const [customMessage, setCustomMessage] = useState(
    `Hello,\n\nPlease find attached my professional profile details below. I would appreciate the opportunity to discuss how my qualifications align with your organization's needs.\n\nBest regards,\n${resumeData.fullName}`
  );
  
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  // Set up Firebase Auth state listener
  useEffect(() => {
    setIsLoadingProfile(true);
    const unsubscribe = initAuth(
      (user, token) => {
        setAccessToken(token);
        setUserProfile({
          email: user.email || undefined,
          name: user.displayName || undefined,
          picture: user.photoURL || undefined,
        });
        setIsLoadingProfile(false);
      },
      () => {
        setAccessToken(null);
        setUserProfile(null);
        setIsLoadingProfile(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Connect via Firebase Google Auth popup window
  const handleConnectGmail = async () => {
    try {
      setSendResult(null);
      setIsLoadingProfile(true);
      const res = await googleSignIn();
      if (res) {
        setAccessToken(res.accessToken);
        setUserProfile({
          email: res.user.email || undefined,
          name: res.user.displayName || undefined,
          picture: res.user.photoURL || undefined,
        });
        setSendResult({
          success: true,
          message: "Securely connected to Gmail successfully!",
        });
      }
    } catch (err: any) {
      console.error("Failed to connect via Google Popup:", err);
      setSendResult({
        success: false,
        message: err.message || "Failed to authenticate with Google. Please enable popup windows and try again.",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Disconnect OAuth connection
  const handleDisconnect = async () => {
    try {
      await firebaseLogout();
      setAccessToken(null);
      setUserProfile(null);
      setSendResult(null);
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  // Generate HTML version of the resume data to send in Gmail body
  const generateResumeHtml = () => {
    const experiencesHtml = resumeData.experience.map(work => `
      <div style="margin-bottom: 16px; border-left: 2px solid #e2e8f0; padding-left: 12px;">
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #1e293b;">
          <span>${work.position || "Undetermined Position"}</span>
          <span style="font-size: 12px; color: #64748b; font-weight: normal;">${work.startDate} - ${work.endDate}</span>
        </div>
        <div style="font-size: 13px; color: #3b82f6; font-weight: 600; margin-top: 2px;">${work.company}</div>
        ${work.description ? `<p style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.5; white-space: pre-line;">${work.description}</p>` : ""}
      </div>
    `).join("");

    const educationHtml = resumeData.education.map(edu => `
      <div style="margin-bottom: 12px;">
        <div style="font-weight: bold; font-size: 14px; color: #1e293b;">${edu.school}</div>
        <div style="font-size: 12px; color: #475569; margin-top: 2px;">
          ${edu.degree} &bull; <span style="font-style: italic;">${edu.fieldOfStudy}</span>
        </div>
        <div style="font-size: 11px; color: #64748b; margin-top: 1px;">Graduated: ${edu.graduationDate}</div>
      </div>
    `).join("");

    const skillsHtml = resumeData.skills.map(skill => `
      <span style="display: inline-block; background-color: #f1f5f9; color: #1e293b; font-size: 12px; font-weight: 500; padding: 4px 10px; margin: 3px; border-radius: 6px; border: 1px solid #e2e8f0;">
        ${skill}
      </span>
    `).join("");

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <!-- Introduction custom message -->
        <div style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
          ${customMessage.replace(/\n/g, "<br>")}
        </div>

        <!-- Professional Resume Card -->
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; background-color: #fafafa;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.5px;">${resumeData.fullName}</h1>
            <div style="margin-top: 8px; font-size: 12px; color: #475569; line-height: 1.5;">
              ${resumeData.email ? `<span>${resumeData.email}</span>` : ""}
              ${resumeData.phone ? ` | <span>${resumeData.phone}</span>` : ""}
              ${resumeData.location ? ` | <span>${resumeData.location}</span>` : ""}
              ${resumeData.website ? ` | <a href="${resumeData.website}" style="color: #3b82f6; text-decoration: none;">Portfolio</a>` : ""}
            </div>
          </div>

          ${resumeData.summary ? `
            <div style="margin-top: 20px;">
              <h2 style="font-size: 12px; text-transform: uppercase; tracking: 0.1em; color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; margin-bottom: 10px;">Professional Profile</h2>
              <p style="font-size: 13px; line-height: 1.5; color: #334155; margin: 0;">${resumeData.summary}</p>
            </div>
          ` : ""}

          ${resumeData.experience.length > 0 ? `
            <div style="margin-top: 24px;">
              <h2 style="font-size: 12px; text-transform: uppercase; tracking: 0.1em; color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; margin-bottom: 12px;">Work Chronicles</h2>
              ${experiencesHtml}
            </div>
          ` : ""}

          ${resumeData.skills.length > 0 ? `
            <div style="margin-top: 24px;">
              <h2 style="font-size: 12px; text-transform: uppercase; tracking: 0.1em; color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; margin-bottom: 12px;">Skills</h2>
              <div style="margin-top: 8px;">${skillsHtml}</div>
            </div>
          ` : ""}

          ${resumeData.education.length > 0 ? `
            <div style="margin-top: 24px;">
              <h2 style="font-size: 12px; text-transform: uppercase; tracking: 0.1em; color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; margin-bottom: 12px;">Academic Credentials</h2>
              ${educationHtml}
            </div>
          ` : ""}
        </div>

        <div style="margin-top: 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          Sent securely via AI Resume Suite • ATS Compliant Digital Format
        </div>
      </div>
    `;
  };

  // Convert raw message parts to base64url standard for Google Gmail send API
  const sendEmailThroughGmailApi = async () => {
    if (!accessToken) {
      alert("Authentication token expired. Please connect your Gmail again.");
      return;
    }

    if (!recipient.trim()) {
      alert("Please enter a valid recipient email address!");
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const emailHtml = generateResumeHtml();

      // Encode special and unicode characters correctly for RFC822 transport
      const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
      const emailContent = [
        `To: ${recipient.trim()}`,
        `Subject: ${utf8Subject}`,
        "Content-Type: text/html; charset=utf-8",
        "MIME-Version: 1.0",
        "",
        emailHtml
      ].join("\r\n");

      // Base64URL encoding safely replacing unsafe characters
      const base64EncodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw: base64EncodedEmail,
        }),
      });

      if (response.ok) {
        setSendResult({
          success: true,
          message: `Successfully transmitted resume email via your Gmail account to ${recipient}!`,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to deliver email through Gmail systems.");
      }
    } catch (err: any) {
      console.error("Gmail send error:", err);
      setSendResult({
        success: false,
        message: err.message || "An unexpected network or scope error occurred.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      theme === "dark" 
        ? "bg-[#161a29] border-white/10" 
        : "bg-white border-slate-200 shadow-xl"
    }`}>
      {/* Header section with setup status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/5 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Gmail Dispatch Center</h4>
            <p className="text-[10px] text-slate-400">Share your ATS-formatted profile instantly</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {accessToken && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Connected
              </span>
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-[10px] text-rose-450 hover:text-rose-400 font-bold transition-colors cursor-pointer flex items-center gap-0.5"
                title="Disconnect Gmail link"
              >
                <LogOut className="w-3 h-3" /> Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoadingProfile && !accessToken && (
        <div className="p-6 text-center flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-550" />
          <span className="text-xs text-slate-400">Verifying security session...</span>
        </div>
      )}

      {/* Unauthorized State Notice */}
      {!accessToken && !isLoadingProfile && (
        <div className="p-6 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-850/50 border border-white/5 flex items-center justify-center text-slate-400">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-200">Gmail Access Required</h5>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
              Enable the Gmail Sharing center to email custom HTML copies of this resume directly to job recruiters, employer pipelines, or yourself in modern ATS formats.
            </p>
          </div>
          
          <div className="pt-2">
            <button
              type="button"
              onClick={handleConnectGmail}
              className="mx-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs select-none shadow-lg hover:shadow-blue-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" /> Link Gmail Now
            </button>
          </div>
        </div>
      )}

      {/* Authorized State Sending Form */}
      {accessToken && !isLoadingProfile && (
        <div className="space-y-4 text-left">
          {/* Active Profile Header */}
          {userProfile && (
            <div className="flex items-center gap-2.5 p-2 bg-white/5 border border-white/5 rounded-xl text-xs">
              {userProfile.picture ? (
                <img referrerPolicy="no-referrer" src={userProfile.picture} alt="User Avatar" className="w-7 h-7 rounded-full border border-white/10" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-[10px]">
                  {userProfile.name?.charAt(0) || "G"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-200 truncate leading-none mb-0.5">{userProfile.name || "Google User"}</div>
                <div className="text-[10px] text-slate-400 truncate">{userProfile.email}</div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3.5 font-sans">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Send Resume To</label>
              <input
                type="email"
                required
                placeholder="recipient@example.com, or your own email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full text-xs bg-black/40 text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Subject Title</label>
              <input
                type="text"
                placeholder="Professional resume and cover note"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs bg-black/40 text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Recruiter Intro Note / Cover context</label>
              <textarea
                rows={4}
                placeholder="Include a greeting and introductory summary note..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full text-xs bg-black/40 text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 font-sans"
              />
            </div>
          </div>

          {/* Feedback message overlay */}
          {sendResult && (
            <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
              sendResult.success 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}>
              {sendResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-450 flex-shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{sendResult.message}</span>
            </div>
          )}

          {/* Dispatch Command Controls */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
            <span className="text-[9px] font-mono text-slate-500">
              * Gmail Delivery Client-to-Server
            </span>
            <button
              type="button"
              onClick={sendEmailThroughGmailApi}
              disabled={isSending || !recipient}
              className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all select-none ${
                isSending || !recipient
                  ? "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg cursor-pointer"
              }`}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span>Send via Gmail</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
