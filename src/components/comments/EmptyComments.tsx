
import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyComments: React.FC = () => {
  return (
    <div className="text-center py-10">
      <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-1">No comments yet</h3>
      <p className="text-muted-foreground">Be the first to share your thoughts!</p>
    </div>
  );
};

export default EmptyComments;
