class CommentDto{
    constructor(comment){
        this.id = comment._id;
        this.author = comment.author;
        this.content = comment.content;
        this.blogId = comment.blogId;
        this.createdAt = comment.createdAt;
    }
}
module.exports = CommentDto;