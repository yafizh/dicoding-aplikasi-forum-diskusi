import CommentItem from './CommentItem';
import EmptyState from '../common/EmptyState';

const CommentList = ({comments}) => {
  if (comments.length === 0) {
    return (
      <EmptyState
        icon="chat"
        title="Belum ada komentar"
        description="Jadilah yang pertama membagikan pendapat pada diskusi ini."
      />
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
