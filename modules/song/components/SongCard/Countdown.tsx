import React from "react"

const Countdown: React.FC<{ countdownString: string }> = ({ countdownString }) => {
  return (
    <div>
      {countdownString && (
        <div className={"relative flex items-center gap-3 py-1 text-sm"}>
          <div className={"relative h-2 w-2 rounded-full"}>
            <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-600 opacity-75"></span>
          </div>
          {countdownString}
        </div>
      )}
    </div>
  )
}

export default Countdown
