import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import safeHtml from 'https://cdn.jsdelivr.net/npm/safe-html@1.0.0/safe-html.min.js';

export class Posts extends LitElement {
  static properties = {
    url: {},
    posts: []
  };

  static styles = css`
  .post-list {
    font-family: Arial, sans-serif;
  }

  h2 {
    color: #333;
    font-family: Arial, sans-serif;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 15px;
  }

  h3 {
    color: #0073e6;
  }

  .error {
    color: red;
  }

  a {
    color: #0073e6;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }`;

  constructor() {
    super();
    this.url = '';
    this.posts = [];
  }
  
  async handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target)
    const formValues = Object.fromEntries(formData.entries())
    const url = `${ formValues.name }/wp-json/wp/v2/posts`
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      this.posts = data;
    }
    catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  render() {
    let posts = '';
    if(this.posts && this.posts.length > 0) {
      posts = html`<h2>Latest Posts</h2>
      <ul class="post-list">
      ${this.posts.map((post) =>
          html`<li>
          <h3>${post.title.rendered}</h3>
            <p>${unsafeHTML(post.excerpt.rendered)}</p>
          </li>`
        )}
      </ul>`
    }
    
    return html`
       <form @submit=${this.handleFormSubmit}>
        <label for="name">Enter WordPress URL:</label>
        <input type="text" id="name" name="name" required />
        
        <input type="submit" value="Submit" />
      </form>
      ${posts}`;
  }
}
customElements.define('wp-posts', Posts);