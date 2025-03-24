// Get forum identifier from URL or set a default one
const forumKey = "topics_forum_konsolipalsta"; // Change this for different forums

document.addEventListener("DOMContentLoaded", function () {
    const showCreateTopic = document.getElementById("showCreateTopic");
    const createTopicSection = document.getElementById("createTopicSection");
    const createTopicBtn = document.getElementById("createTopicBtn");
    const topicTitleInput = document.getElementById("topicTitle");
    const topicMessageInput = document.getElementById("topicMessage");
    const topicsList = document.getElementById("topicsList");

    showCreateTopic.addEventListener("click", function () {
        createTopicSection.classList.toggle("hidden");
    });

    function loadTopics() {
        topicsList.innerHTML = "";
        const topics = JSON.parse(localStorage.getItem(forumKey)) || []; // Use unique forum key
        topics.forEach((topic, index) => {
            const topicDiv = document.createElement("div");
            topicDiv.classList.add("table-row");
            topicDiv.innerHTML = `
                <div class="status"><i class="fa fa-book"></i></div>
                <div class="subjects">
                    <a href="konsolikeskustelu.html?index=${index}&forumKey=${forumKey}">${topic.title}</a><br>
                    <span>Started by <b>User</b></span>
                </div>
                <div class="replies">0 replies <br> 0 views</div>
                <div class="last-reply">-</div>
            `;
            topicsList.appendChild(topicDiv);
        });
    }

    createTopicBtn.addEventListener("click", function () {
        const title = topicTitleInput.value.trim();
        const message = topicMessageInput.value.trim();
        if (title && message) {
            let topics = JSON.parse(localStorage.getItem(forumKey)) || [];
            topics.push({ title, message, replies: [] });
            localStorage.setItem(forumKey, JSON.stringify(topics)); // Save under unique forum key
            topicTitleInput.value = "";
            topicMessageInput.value = "";
            createTopicSection.classList.add("hidden");
            loadTopics();
        } else {
            alert("Please enter both a title and a message!");
        }
    });

    loadTopics();
});

function deleteItems() {
    localStorage.removeItem(forumKey); // Delete only current forum topics
    location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const topicIndex = urlParams.get("index");
    const forumKey = urlParams.get("forumKey"); // Retrieve forum key from URL

    const topicTitleElement = document.getElementById("topicTitle");
    const topicMessageElement = document.getElementById("topicMessage");
    const commentsSection = document.getElementById("commentsSection");
    const replyInput = document.getElementById("replyInput");
    const replyBtn = document.getElementById("replyBtn");

    let topics = JSON.parse(localStorage.getItem(forumKey)) || [];

    if (topicIndex !== null && topics[topicIndex]) {
        topicTitleElement.textContent = topics[topicIndex].title;
        topicMessageElement.textContent = topics[topicIndex].message;
    } else {
        topicTitleElement.textContent = "Unknown Topic";
    }

    function loadComments() {
        commentsSection.innerHTML = "";
        let topic = topics[topicIndex] || { replies: [] };

        topic.replies.forEach((replyObj, index) => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("body");
            commentDiv.innerHTML = `
                <div class="authors">
                    <div class="username"><a href="">User${index + 1}</a></div>
                    <div>Role</div>
                    <img src="https://cdn.pixabay.com/photo/2015/11/06/13/27/ninja-1027877_960_720.jpg" alt="User Avatar">
                    <div>Posts: <u>${Math.floor(Math.random() * 100)}</u></div>
                    <div>Points: <u>${Math.floor(Math.random() * 5000)}</u></div>
                </div>
                <div class="content">
                    <div>
                        <p>${replyObj.text}</p>
                        <div class="stat-item">
                            <h1>Likes: <span id="like-count-${index}">${replyObj.likes}</span></h1>
                            <button class="like-button" onclick="incrementLikes(${index})">Like</button>
                        </div>
                    </div>
                </div>
            `;
            commentsSection.appendChild(commentDiv);
        });
    }

    replyBtn.addEventListener("click", function () {
        const comment = replyInput.value.trim();
        if (comment) {
            if (!topics[topicIndex].replies) topics[topicIndex].replies = [];
            topics[topicIndex].replies.push({ text: comment, likes: 0 });
            localStorage.setItem(forumKey, JSON.stringify(topics)); // Store under correct forum key
            replyInput.value = "";
            loadComments();
        }
    });

    window.incrementLikes = function (commentIndex) {
        topics[topicIndex].replies[commentIndex].likes += 1;
        localStorage.setItem(forumKey, JSON.stringify(topics));
        document.getElementById(`like-count-${commentIndex}`).innerText = topics[topicIndex].replies[commentIndex].likes;
    };

    loadComments();
});
