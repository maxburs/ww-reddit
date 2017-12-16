import * as React from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

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

interface AppState {
  subreddits: string[];
  posts: PostInfo[];
}

class App extends React.Component {

  private subreddits = ['news'];
  public state: AppState = {
    subreddits: this.subreddits,
    posts: [],
  };

  constructor(props: {}) {
    super(props);
    this.updatePosts();
  }

  removeSubreddit(subreddit: string) {
    this.subreddits.splice(this.subreddits.indexOf(subreddit), 1);
    this.updatedSubreddits();
    this.updatePosts();
  }

  addSubreddit(subreddit: string) {
    this.subreddits.push(subreddit);
    this.updatedSubreddits();
    this.updatePosts();
  }

  updatedSubreddits() {
    this.setState({subreddits: this.subreddits});
  }

  updatePosts() {
    window.console.log('updating posts: ', this.subreddits);
    if (this.subreddits.length === 0) {
      this.setState({posts: []});
      return;
    }

    fetch(`https://www.reddit.com/r/${this.state.subreddits.join('+')}/hot.json`)
    .then(response => response.json())
    .then((blob) => {
      if (blob.error) {
        window.alert(`error:  ${ blob.error}`);
        return;
      }

      this.setState({posts: blob.data.children.map((c: {data: PostInfo}) => c.data)});
    });
  }

  render() {

    return (
      <div className="App">
        <AddSubreddit onNewSubreddit={s => this.addSubreddit(s)} />
        <div className="App-header" >
          {this.state.subreddits.map((s, index) => (
            <Chip key={index} onRequestDelete={(event: {}) => this.removeSubreddit(s)} >{s}</Chip>
          ))}
        </div>
        <div>
          {this.state.posts.map(post => <Post key={post.id} info={post} />)}
        </div>
      </div>
    );
  }
}

function AddSubreddit(props: {onNewSubreddit: (subreddit: string) => void}) {
  let textElement: TextField | null;

  return (
    <div>
      <TextField name="newSubredditName" ref={(f) => {textElement = f; }}/>
      <RaisedButton onClick={() => {
        if (textElement) {
          props.onNewSubreddit(textElement.getValue());
        }
      }}>Add</RaisedButton>
    </div>
  );
}

function Post(props: {info: PostInfo}) {
  return (
    <div>
      <a href={props.info.url} >{props.info.title}</a>
    </div>
  );
}

export default () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);
