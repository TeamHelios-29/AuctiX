import { ChatMessageProps } from '@/types/IChatMessageProps';
import clsx from 'clsx';

function ChatMessage({
  id,
  message,
  displayName,
  userRole,
  timestamp,
  isSentByCurrentUser,
}: ChatMessageProps) {
  const isSeller = userRole === 'SELLER';

  const senderLabel = isSentByCurrentUser
    ? isSeller
      ? 'You (Seller)'
      : 'You'
    : `${displayName} (${userRole})`;

  return (
    <div
      className={clsx(
        'flex flex-col gap-1',
        isSentByCurrentUser && 'items-end',
      )}
    >
      <div
        className={clsx(
          'px-4 py-2 rounded-lg  w-fit max-w-[80%] min-w-48 break-words',
          isSentByCurrentUser
            ? 'bg-slate-900 text-white'
            : isSeller
              ? 'bg-slate-500 text-slate-200'
              : 'bg-gray-200 text-slate-900',
        )}
      >
        {message}
      </div>

      <div
        className={clsx(
          'text-xs text-slate-950',
          isSentByCurrentUser ? 'text-right' : 'text-left',
        )}
      >
        <span className={clsx(isSeller ? 'font-bold' : 'font-normal')}>
          {senderLabel}
        </span>
        {' • '}
        {timestamp.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}

export { ChatMessage };
export type { ChatMessageProps };
