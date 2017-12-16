import * as React from 'react';
import './App.css';

interface PostInfo {
    author: string;
    clicked: boolean;
    id: string;
    name: string;
    num_comments: number;
    over_18: boolean;
    permalink: string;
    pinned: boolean;
    score: number;
    // secure_media: null
    // secure_media_embed: {}
    spoiler: boolean;
    stickied: boolean;
    subreddit: string;
    subreddit_id: string;
    subreddit_name_prefixed: string;
    suggested_sort: null;
    thumbnail: string;
    title: string;
    ups: number;
    url: string;
    visited: boolean;
}

// function Post(props: {info: PostInfo}) {

//     console.log(props);
//     const info = props.info;
//     return <div><a href={info.url}>{info.title}</a></div>;
// }

class App extends React.Component {

  public state: {
    reddits: string[];
    posts: PostInfo[];
  } = {
    reddits: ['news'],
    posts: [],
  };
  constructor(props: {}) {
    super(props);
    this.updatePosts();
  }

  updatePosts() {
    fetch(`https://www.reddit.com/r/${this.state.reddits.join('+')}/hot.json`)
    .then(response => response.json())
    .then(blob => {
      window.console.log(blob);
      this.setState({posts: blob.data.children.map((c: {data: PostInfo}) => c.data)});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {this.state.reddits.map(reddit => <span key={reddit} >{reddit}</span>)}
        </div>
        <div>
          {this.state.posts.map(post => <div key={post.id} ><a href={post.url}>{post.title}</a></div>)}
        </div>
      </div>
    );
  }
}

export default App;
