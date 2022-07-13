import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FormEvent, useState, ChangeEvent, InvalidEvent } from 'react';
import { Avatar } from './Avatar'
import { Comment } from './Comment'
import styles from './Post.module.css'

interface Author {
    name: string;
    role: string;
    avatarUrl: string;
}

interface Content {
    type: 'paragraph' | 'link';
    content: string;
}
interface PostProps {
    author: Author;
    publishedAt: Date;
    content: Content[];
}

export function Post({author, publishedAt, content}:PostProps){

    const [comments, setComments] = useState(['Boa!'])
    

    const [newCommentText, setNewCommentText] = useState('');

    const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
        locale: ptBR
    })

    const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
        locale: ptBR,
        addSuffix: true
    })

    function handleCreateNewComment(event:FormEvent){
        event.preventDefault()
       
        setComments([...comments, newCommentText])
        setNewCommentText('')
        
    }

    function handleNewCommentInvalid(event:InvalidEvent<HTMLTextAreaElement>){
        event.target.setCustomValidity("Este campo é obrigatório!!")
    }

    function handleNewCommentChange(event:ChangeEvent<HTMLTextAreaElement>){
        event.target.setCustomValidity('')
        setNewCommentText(event.target.value)
    }

    function deleteComment(commentToDelete:string){
       const newListComments = comments.filter(comment => {
        return comment !== commentToDelete;
       }) 

       setComments(newListComments);
    }

    const isNewCommentEmpty = newCommentText.length === 0;

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={author.avatarUrl} />
                    <div className={styles.authorInfo}>
                        <strong>{author.name}</strong>
                        <span>{author.role}</span>

                    </div>
                </div>
                <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>
                    Publicado {publishedDateRelativeToNow}
                </time>
            </header>
            <div className={styles.content}>
             {content.map(line => {
                if(line.type === 'paragraph'){
                    return <p key={line.content}>{line.content}</p>
                }
                if(line.type === 'link'){
                    return <p key={line.content}><a href="#">{line.content}</a></p>
                }
             })}
            </div>

            <form onSubmit={handleCreateNewComment} className={styles.comentForm}>
                <strong>Deixe seu feedback</strong>
                <textarea 
                    name='comment'
                    value={newCommentText}
                    placeholder='Deixe um comentário'
                    onChange={handleNewCommentChange}
                    onInvalid={handleNewCommentInvalid}
                    required
                />
                <footer>
                    <button 
                    type='submit'
                    disabled={isNewCommentEmpty}
                    >Publicar</button>
                </footer>
                
            </form>
            <div className={styles.commentList}>
                {comments.map(c => {
                    
                    return <Comment key={c} content={c} onDeleteComment={deleteComment}/>
                })}
                
            </div>
        </article>
    )
}