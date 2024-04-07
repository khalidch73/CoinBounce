// dto data transfer object

class BlogDto{
    constructor(blog){
        this.id = blog._id;
        this.author = blog.author;
        this.content = blog.content;
        this.title = blog.title;
        this.photoPath = blog.photoPath;
    }
}
module.exports = BlogDto;

// 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA'