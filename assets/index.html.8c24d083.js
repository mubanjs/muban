import{r as o,o as l,c as u,d as s,w as a,F as i,b as t,e as n,a as c}from"./app.7a437beb.js";import{_ as r}from"./plugin-vue_export-helper.21dcd24c.js";const k={},b=t("h1",{id:"getting-started",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#getting-started","aria-hidden":"true"},"#"),n(" Getting started")],-1),d=t("h2",{id:"installing",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#installing","aria-hidden":"true"},"#"),n(" Installing")],-1),m=t("p",null,[n("Add "),t("code",null,"muban"),n(" to your project:")],-1),g=n(" ```sh yarn add @muban/muban ``` "),h=n(" ```sh npm i -S @muban/muban ``` "),y=c(`<h2 id="simple-component" tabindex="-1"><a class="header-anchor" href="#simple-component" aria-hidden="true">#</a> Simple component</h2><p>Create your component:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent<span class="token punctuation">,</span> bind<span class="token punctuation">,</span> ref <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@muban/muban&#39;</span><span class="token punctuation">;</span>
 
<span class="token keyword">const</span> MyComponent <span class="token operator">=</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;my-component&#39;</span><span class="token punctuation">,</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">{</span> props<span class="token punctuation">,</span> refs <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> content <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token string">&#39;Hello World&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token punctuation">[</span>
      <span class="token function">bind</span><span class="token punctuation">(</span>refs<span class="token punctuation">.</span>self<span class="token punctuation">,</span> <span class="token punctuation">{</span> text<span class="token operator">:</span> content<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>Make sure to have the following HTML on the page:</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">&gt;</span></span>
  ...
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">data-component</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>my-component<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Hello<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line">\xA0</div><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>Then init your component:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createApp <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@muban/muban&#39;</span><span class="token punctuation">;</span>

<span class="token function">createApp</span><span class="token punctuation">(</span>MyComponent<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">mount</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span>body<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>Your page should now display <code>Hello World</code> if your component is correctly running.</p><h2 id="dev-template" tabindex="-1"><a class="header-anchor" href="#dev-template" aria-hidden="true">#</a> Dev template</h2><p>Create our template:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> html <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@muban/template&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">type</span> <span class="token class-name">MyComponentProps</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  welcomeText<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">myComponentTemplate</span><span class="token punctuation">(</span><span class="token punctuation">{</span> welcomeText <span class="token punctuation">}</span><span class="token operator">:</span> MyComponentProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> html<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">&lt;div data-component=&quot;my-component&quot;&gt;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>welcomeText<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&lt;/div&gt;</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>Make sure to have the following HTML on the page:</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">&gt;</span></span>
  ...
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>app<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">data-component</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>my-component<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Hello<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>Render your template:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createApp <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@muban/muban&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> appRoot <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">createApp</span><span class="token punctuation">(</span>MyComponent<span class="token punctuation">)</span><span class="token punctuation">;</span>
app<span class="token punctuation">.</span><span class="token function">mount</span><span class="token punctuation">(</span>appRoot<span class="token punctuation">,</span> myComponentTemplate<span class="token punctuation">,</span> <span class="token punctuation">{</span> welcomeText<span class="token operator">:</span> <span class="token string">&#39;Hello&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="using-storybook" tabindex="-1"><a class="header-anchor" href="#using-storybook" aria-hidden="true">#</a> Using Storybook</h2><p>Add <code>@muban/storybook</code> to your project:</p>`,17),v=n(" ```sh yarn add @muban/storybook ``` "),f=n(" ```sh npm i -S @muban/storybook ``` "),_=c(`<p>Add these two scripts in your <code>package.json</code></p><div class="language-json ext-json line-numbers-mode"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;storybook&quot;</span><span class="token operator">:</span> <span class="token string">&quot;start-storybook -p 6006&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;build-storybook&quot;</span><span class="token operator">:</span> <span class="token string">&quot;build-storybook -o ./dist/storybook&quot;</span>  
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>Create your <code>.storybook/main.js</code> with this content:</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">stories</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">&#39;../src/**/*.stories.mdx&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;../src/**/*.stories.@(js|ts)&#39;</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">addons</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">&#39;@storybook/addon-essentials&#39;</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>Create your story file:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> Story <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@muban/storybook&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  title<span class="token operator">:</span> <span class="token string">&#39;MyComponent&#39;</span><span class="token punctuation">,</span>
  argTypes<span class="token operator">:</span> <span class="token punctuation">{</span>
    welcomeText<span class="token operator">:</span> <span class="token punctuation">{</span> control<span class="token operator">:</span> <span class="token string">&#39;text&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> Default<span class="token operator">:</span> Story<span class="token operator">&lt;</span>MyComponentProps<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
  template<span class="token operator">:</span> myComponentTemplate<span class="token punctuation">,</span>
  component<span class="token operator">:</span> MyComponent<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
Default<span class="token punctuation">.</span>args <span class="token operator">=</span> <span class="token punctuation">{</span>
  welcomeText<span class="token operator">:</span> <span class="token string">&#39;Hello&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>Run storybook:</p>`,7),w=n(" ```sh yarn storybook ``` "),x=n(" ```sh npm run storybook ``` ");function q(C,M){const p=o("code-block"),e=o("code-group");return l(),u(i,null,[b,d,m,s(e,null,{default:a(()=>[s(p,{title:"YARN"},{default:a(()=>[g]),_:1}),s(p,{title:"NPM"},{default:a(()=>[h]),_:1})]),_:1}),y,s(e,null,{default:a(()=>[s(p,{title:"YARN"},{default:a(()=>[v]),_:1}),s(p,{title:"NPM"},{default:a(()=>[f]),_:1})]),_:1}),_,s(e,null,{default:a(()=>[s(p,{title:"YARN"},{default:a(()=>[w]),_:1}),s(p,{title:"NPM"},{default:a(()=>[x]),_:1})]),_:1})],64)}var A=r(k,[["render",q]]);export{A as default};
