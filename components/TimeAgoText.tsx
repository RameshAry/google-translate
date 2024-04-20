"use client";
import ReactTimeAgo from "react-timeago";

function TimeAgoText({ date }: { date: string }) {
  return <ReactTimeAgo date={date} />;
}

export default TimeAgoText;
