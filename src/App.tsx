import * as React from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardText, CardTitle } from 'material-ui/Card';

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

      this.setState({
        posts: blob.data.children.map((c: {data: PostInfo}) => c.data)
      });
    });
  }

  render() {

    return (
      <div className="App">
        <AddSubreddit onNewSubreddit={s => this.addSubreddit(s)} />
        <Subreddits
          subreddits={this.state.subreddits}
          removeSubreddit={(s) => this.removeSubreddit(s)}
          />
        <div>
          {this.state.posts.map(post => <Post key={post.id} info={post} />)}
        </div>
      </div>
    );
  }
}

function Subreddits(
  props: {
    subreddits: string[];
    removeSubreddit: (subreddit: string) => void;
  }
) {
  const style = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '10px 0px',
  };

  return (
    <div style={style as {}} >
    {props.subreddits.map((s, index) => (
      <Chip
        key={index}
        onRequestDelete={() => props.removeSubreddit(s)}
        >{s}</Chip>
    ))}
  </div>
  );
}

function AddSubreddit(
  props: {
    onNewSubreddit: (subreddit: string) => void
  }
) {
  let textElement: TextField | null;

  const style = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const submit = () => {
    if (textElement) {
      props.onNewSubreddit(textElement.getValue());
    }
  };

  // note: typing is broken for flexDirection
  return (
    <div style={style as {}} >
      <TextField
        name="newSubredditName"
        hintText="subreddit"
        ref={(f) => {textElement = f; }}
        style={{marginRight: '10px'}}
        onKeyUp={(event) => {
          window.console.log(event.keyCode);
          if (event.keyCode === 13) {
            event.preventDefault();
            submit();
          }
        }}
      />
      <RaisedButton onClick={submit}>Add</RaisedButton>
    </div>
  );
}

function Post(props: {info: PostInfo}) {
  const cardStyle = {
    margin: '5px 0px'
  };

  return (
    <a style={{textDecoration: 'none'}} href={props.info.url} >
      <Card style={cardStyle}>
        <CardTitle>{props.info.score}</CardTitle>
        <CardText>{props.info.title}</CardText>
      </Card>
    </a>
  );
}

export default () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);
