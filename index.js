import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'uuid';

document.addEventListener('click', function(e){
    // hide the delete button if somewhere else is clicked
   
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id==="reply-btn"){
        
        handleReplyBtn(e.target.parentElement.parentElement.dataset.answer);
    }
    // option dots
    else if(e.target.classList.contains("option-dots")){
        
        handleOptionDots(e.target.parentElement, e.target.dataset.option);
    }
    // tweet delete button
    else if(e.target.classList.contains("tweet-del-btn")){

    }
})
// handling option dots
function handleOptionDots(targetTweet, tweetId){
    console.log("optionn handlee");
    const del_btn = targetTweet.querySelector(".tweet-del-btn");
    del_btn.classList.toggle("del_btn_hide");

    // if delelte btn is clicked, delete the tweet
    del_btn.addEventListener("click",()=>{
             // find the targeted tweet
     let tweetIndex = -1; 
     Array.from(tweetsData).forEach((tweet,index) => {
       if(tweet.uuid === tweetId){
       tweetIndex=index;
       return;
       }
    })
    console.log("tweetIndex",tweetIndex);
        console.log("deletedd");
        if(tweetIndex>-1)
       tweetsData.splice(tweetIndex,1);
       render();
    });

//    const del_btn = targetTweetObj.querySelector(".tweet-del-btn")[0];
//    console.log(del_btn);
}
 function handleReplyBtn(replyId){
    const replies = Array.from(document.getElementsByClassName("reply-input"));
   const reply = replies.filter(re=>{
       return re.dataset.answer === replyId;
    })[0];

    // find the targeted tweet 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === replyId
    })[0]
    // push the new reply
   targetTweetObj.replies.push(   {
    handle: "@Yasir",
    profilePic: "images/yasir.jpg",
    tweetText: reply.children.item(1).value
});
render();
 }

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Yasir`,
            profilePic: `images/yasir.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
            isDelete: true
        })
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}

        <div class="reply-input" data-answer=${tweet.uuid}>
        <img src="images/yasir.jpg" class="profile-pic" id="profile-pic">
        <textarea placeholder="Reply..." id="tweet-reply"></textarea>
        <div><button id="reply-btn">Reply</button></div>
        </div>

    </div>   

`;
if(tweet.isDelete) //add a delete button if its our tweet
feedHtml+= `<span class="option-dots" data-option=${tweet.uuid}>...</span>
            <p class=" tweet-del-btn del_btn_hide">Delete</p>
</div>`
// feedHtml+=`<i class="fa fa-trash delete-icon"></i></div>`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

