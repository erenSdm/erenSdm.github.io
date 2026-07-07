"use client";

import { MessageSquare, GitBranch, CalendarClock, Ban } from "lucide-react";
import type { Issue } from "./data";
import { Avatar, LabelPill, PriorityIcon, MONO } from "./atoms";

export function IssueCard({ issue, focused = false }: { issue: Issue; focused?: boolean }) {
  const done = issue.status === "done";

  return (
    <article
      tabIndex={0}
      className={
        "group relative cursor-default rounded-[7px] border bg-[#141417] px-2.5 pb-2.5 pt-2 outline-none transition-all duration-150 " +
        "hover:border-[#33333c] hover:bg-[#17171b] focus-visible:ring-2 focus-visible:ring-[#6366f1] " +
        (focused
          ? "border-[#6366f1] ring-2 ring-[#6366f1]/60"
          : "border-[#232329]")
      }
    >
      {/* top row: id + priority */}
      <div className="flex items-center justify-between">
        <span className={`text-[10.5px] tracking-wide text-[#6b6b64] ${MONO}`}>
          {issue.id}
        </span>
        <div className="flex items-center gap-1.5">
          {issue.blocked && (
            <span title="Blocked" className="flex items-center">
              <Ban size={12} className="text-[#f87368]" strokeWidth={2.2} />
            </span>
          )}
          <PriorityIcon priority={issue.priority} />
        </div>
      </div>

      {/* title */}
      <h3
        className={
          "mt-1 text-[12.5px] font-medium leading-[1.35] " +
          (done ? "text-[#7a7a72] line-through decoration-[#3f3f44]" : "text-[#e9e9e4]")
        }
      >
        {issue.title}
      </h3>

      {/* labels */}
      {issue.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {issue.labels.map((l) => (
            <LabelPill key={l.name} name={l.name} color={l.color} />
          ))}
        </div>
      )}

      {/* footer meta */}
      <div className="mt-2.5 flex items-center justify-between">
        <div className={`flex items-center gap-2.5 text-[10.5px] text-[#6b6b64] ${MONO}`}>
          {/* points */}
          <span
            className="flex h-[16px] min-w-[16px] items-center justify-center rounded-[4px] bg-[#1c1c21] px-1 text-[#8a8a82]"
            title={`${issue.points} points`}
          >
            {issue.points}
          </span>
          {issue.subtasks && (
            <span
              className="flex items-center gap-1"
              title={`${issue.subtasks.done}/${issue.subtasks.total} sub-tasks`}
            >
              <GitBranch size={12} strokeWidth={1.8} />
              {issue.subtasks.done}/{issue.subtasks.total}
            </span>
          )}
          {issue.comments > 0 && (
            <span className="flex items-center gap-1" title={`${issue.comments} comments`}>
              <MessageSquare size={12} strokeWidth={1.8} />
              {issue.comments}
            </span>
          )}
          {issue.due && (
            <span
              className={
                "flex items-center gap-1 " +
                (issue.overdue ? "text-[#f87368]" : "")
              }
              title={issue.overdue ? "Overdue" : "Due date"}
            >
              <CalendarClock size={12} strokeWidth={1.8} />
              {issue.due}
            </span>
          )}
        </div>
        <Avatar person={issue.assignee} size={20} />
      </div>
    </article>
  );
}
