import{r as p,o as l,c as r,b as n,d as a,w as e,F as i,e as s,a as o}from"./app.7a437beb.js";import{_ as u}from"./plugin-vue_export-helper.21dcd24c.js";const d={},k=n("h1",{id:"component-props",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#component-props","aria-hidden":"true"},"#"),s(" Component Props")],-1),h={class:"table-of-contents"},m=s("HTML"),b=s("data- attributes"),g=s("data-props"),f=s("JSON script tag"),y=s("Definition"),w=s("Usage"),v=s("Changing props"),_=s("Updating"),q=s("Reacting"),x=s("Responsibility"),j=o(`<p>This document explores how to integrate &quot;outside&quot; props into the component.</p><p>In muban, components are mounted on existing DOM elements, instead of rendered by a parent. This means that passing of props happens through the HTML, at least initially. The most straight-forward way of defining props in html is through the <code>data-</code> attributes (e.g. <code>&lt;div data-color=&quot;#FF0000&quot;&gt;</code>).</p><p>Components can read these properties through the <code>dataset</code> DOM API: <code>element.dataset.color</code>.</p><p>While the above works fine for basic scenarios, we can do a lot of things to improve the Developer Experience.</p><h2 id="html" tabindex="-1"><a class="header-anchor" href="#html" aria-hidden="true">#</a> HTML</h2><h3 id="data-attributes" tabindex="-1"><a class="header-anchor" href="#data-attributes" aria-hidden="true">#</a> <code>data-</code> attributes</h3><p>As seen in the example we can use <code>data-</code> attributes to store property values. When defining them, they are always strings. If we need to convert them to other primitives or objects, we have to do that ourselves.</p><h3 id="data-props" tabindex="-1"><a class="header-anchor" href="#data-props" aria-hidden="true">#</a> data-props</h3><p>One way to improve on this, is to use a single <code>data-props</code> attribute, and fill this with a JSON payload.</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">data-props</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&#39;</span>{ <span class="token punctuation">&quot;</span>foo<span class="token punctuation">&quot;</span>: true, <span class="token punctuation">&quot;</span>bar<span class="token punctuation">&quot;</span>: [1, 5], <span class="token punctuation">&quot;</span>baz<span class="token punctuation">&quot;</span>: <span class="token punctuation">&quot;</span>you<span class="token punctuation">&#39;</span></span><span class="token attr-name">re</span> <span class="token attr-name">it&quot;</span> <span class="token attr-name">}&#39;</span><span class="token punctuation">&gt;</span></span>test<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Pros:</p><ul><li>single data attribute, clear purpose</li><li>allows nested objects and arrays as properties</li><li>allows typing</li></ul><p>Cons:</p><ul><li>awkward syntax with single-quotes around the JSON</li><li>might be harder to conditionally render for CMS systems in the template language, or connect to CMS UI settings</li><li>needs to be escaped to allow for single quotes (or other dangerous sequences) (<code>%27</code>)</li></ul><h3 id="json-script-tag" tabindex="-1"><a class="header-anchor" href="#json-script-tag" aria-hidden="true">#</a> JSON script tag</h3><p>Another option would be to output a script tag within the component HTML (that is not executed), that contains a JSON payload. This can be read and parsed by the component, and exposed as a props object.</p><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">data-component</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>carousel<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>application/json<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token punctuation">{</span> <span class="token string-property property">&quot;foo&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token string-property property">&quot;bar&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token string-property property">&quot;baz&quot;</span><span class="token operator">:</span> <span class="token string">&quot;you&#39;re it&quot;</span> <span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>other HTML<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>Pros:</p><ul><li>dedicated place to put props</li><li>allows nested objects and arrays as properties</li><li>allows typing</li><li>no encoding issues</li></ul><p>Cons:</p><ul><li>might be harder to conditionally render for CMS systems in the template language, or connect to CMS UI settings</li><li>outputs a bit more code on the page</li></ul><h2 id="definition" tabindex="-1"><a class="header-anchor" href="#definition" aria-hidden="true">#</a> Definition</h2><p>Even though the props can be retrieved from the HTML and exposed as an object, in the component itself we have no guarantees or information about them. If we can define them as prop types, we can use this information in the component.</p><p>Inspired by Vue, we could use something similar:</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// Basic type check (\`null\` and \`undefined\` values will pass any type validation)</span>
    <span class="token literal-property property">propA</span><span class="token operator">:</span> Number<span class="token punctuation">,</span>
    <span class="token comment">// Multiple possible types</span>
    <span class="token literal-property property">propB</span><span class="token operator">:</span> <span class="token punctuation">[</span>String<span class="token punctuation">,</span> Number<span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token comment">// Required string</span>
    <span class="token literal-property property">propC</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> String<span class="token punctuation">,</span>
      <span class="token literal-property property">required</span><span class="token operator">:</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// Number with a default value</span>
    <span class="token literal-property property">propD</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> Number<span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token number">100</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// Object with a default value</span>
    <span class="token literal-property property">propE</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> Object<span class="token punctuation">,</span>
      <span class="token comment">// Object or array defaults must be returned from</span>
      <span class="token comment">// a factory function</span>
      <span class="token function-variable function">default</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">{</span> <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">&#39;hello&#39;</span> <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// Custom validator function</span>
    <span class="token literal-property property">propF</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function-variable function">validator</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// The value must match one of these strings</span>
        <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token string">&#39;success&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;warning&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;danger&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token operator">-</span><span class="token number">1</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br></div></div>`,25),M=s("Or more powerful "),T={href:"https://github.com/dwightjack/vue-types",target:"_blank",rel:"noopener noreferrer"},O=s("vue-types"),C=s(":"),D=o(`<div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// Basic type check (\`null\` and \`undefined\` values will pass any type validation)</span>
    <span class="token literal-property property">propA</span><span class="token operator">:</span> Number<span class="token punctuation">,</span>
    <span class="token comment">// Multiple possible types</span>
    <span class="token literal-property property">propB</span><span class="token operator">:</span> VueTypes<span class="token punctuation">.</span><span class="token function">oneOfType</span><span class="token punctuation">(</span><span class="token punctuation">[</span>String<span class="token punctuation">,</span> Number<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// Required string</span>
    <span class="token literal-property property">propC</span><span class="token operator">:</span> VueTypes<span class="token punctuation">.</span>string<span class="token punctuation">.</span>isRequired<span class="token punctuation">,</span>
    <span class="token comment">// Number with a default value</span>
    <span class="token literal-property property">propD</span><span class="token operator">:</span> VueTypes<span class="token punctuation">.</span>number<span class="token punctuation">.</span><span class="token function">def</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// Object with a default value</span>
    <span class="token literal-property property">propE</span><span class="token operator">:</span> VueTypes<span class="token punctuation">.</span><span class="token function">shape</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">message</span><span class="token operator">:</span> String<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">def</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">&#39;hello&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// Custom validator function</span>
    <span class="token literal-property property">propF</span><span class="token operator">:</span> VueTypes<span class="token punctuation">.</span>string<span class="token punctuation">.</span><span class="token function">validate</span><span class="token punctuation">(</span><span class="token parameter">val</span> <span class="token operator">=&gt;</span> <span class="token punctuation">[</span><span class="token string">&#39;success&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;warning&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;danger&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>The main thing to accomplish, besides all the features above, is to type the props object that is used in the component:</p><ul><li>with the right type/shape</li><li>with the right optional/required</li></ul><h2 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h2><p>I think this is pretty straight forward when settling on a component design itself, but could look like:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// function component</span>
<span class="token keyword">const</span> propTypes <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token keyword">function</span> <span class="token function">Carousel</span><span class="token punctuation">(</span>props<span class="token operator">:</span> Props<span class="token operator">&lt;</span><span class="token keyword">typeof</span> propTypes<span class="token operator">&gt;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// can this be inferred?</span>
<span class="token punctuation">}</span>
Carousel<span class="token punctuation">.</span>propTypes <span class="token operator">=</span> propTypes<span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// class component</span>
<span class="token keyword">class</span> <span class="token class-name">Carousel</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractComponent</span> <span class="token punctuation">{</span>
  propTypes <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// how to type?</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span>props
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// options component</span>
<span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  props<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">{</span> props <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// types are &quot;fixed&quot; by \`defineComponent\`</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="changing-props" tabindex="-1"><a class="header-anchor" href="#changing-props" aria-hidden="true">#</a> Changing props</h2><p>In some scenarios it could happen that a parent component wants a child component to update based on user interaction. A way to do this would be to change the props for that child component. This will need two things to work:</p><ol><li>A way for the parent to change/pass the props</li><li>A way for the child component to receive &quot;updates&quot; when those props are changed.</li></ol><h3 id="updating" tabindex="-1"><a class="header-anchor" href="#updating" aria-hidden="true">#</a> Updating</h3><p>Since the original props are stored on the DOM in some way, updating the props could be done in the same way, where a util function could write the updated props to the DOM, signals the child component, which re-executes their prop-logic.</p><p>The alternative is to bypass the DOM, and directly pass the (new) props to the validation function. This saves us from writing to and reading from the DOM. Storing this information in the DOM will probably not be needed for anything else.</p><h3 id="reacting" tabindex="-1"><a class="header-anchor" href="#reacting" aria-hidden="true">#</a> Reacting</h3><p>Reacting to prop updates will be different depending on the type of component, and the chosen architecture (reactive vs pure).</p><p>For class-based components, it&#39;s not possible to call the constructor again with the new props. Similar to the React class components, we could call a componentWillReceiveProps function, or something similar, that passes the new props.</p><p>For a pure setup with just a function, it can just re-execute the function with the new props. Pretty simple.</p><p>For a reactive setup, with an options-object, the passed props object should probably be observable. If the original props were used in any other reactive structures or DOM bindings, those should be re-execute automatically.</p><h2 id="responsibility" tabindex="-1"><a class="header-anchor" href="#responsibility" aria-hidden="true">#</a> Responsibility</h2><p>Who should be responsible for what?</p><p>A single component could perfectly read and process its own props from the DOM. Different components could theoretically implement different methods of placing, reading, parsing/validating and using the props. Which is perfect.</p><p>But, when components need to communicate with each other, who is responsible for updating the props from the outside? Can we define a common public API for all component types that allow all different component designs to talk to each other without needing additional framework utils?</p><p>Even if that&#39;s possible, how would a parent component get hold of a child component &quot;instance&quot;? Could this happen by just storing the reference in the DOM element - so there is no need for a framework that provides lookup access? It seems that storing such information in the DOM itself is not possible (the DOM APIs are deprecated), so the only option seems to be to use a <code>WeakMap</code> with the DOM element as key, and the component as value. This WeakMap should live somewhere &quot;global&quot;, so should probably be considered part of the framework - that could provide util functions to make working with this easier?</p><p>Maybe, the component part of the &quot;framework&quot; should just be part of the component package!</p>`,25);function S(N,I){const t=p("RouterLink"),c=p("ExternalLinkIcon");return l(),r(i,null,[k,n("nav",h,[n("ul",null,[n("li",null,[a(t,{to:"#html"},{default:e(()=>[m]),_:1}),n("ul",null,[n("li",null,[a(t,{to:"#data-attributes"},{default:e(()=>[b]),_:1})]),n("li",null,[a(t,{to:"#data-props"},{default:e(()=>[g]),_:1})]),n("li",null,[a(t,{to:"#json-script-tag"},{default:e(()=>[f]),_:1})])])]),n("li",null,[a(t,{to:"#definition"},{default:e(()=>[y]),_:1})]),n("li",null,[a(t,{to:"#usage"},{default:e(()=>[w]),_:1})]),n("li",null,[a(t,{to:"#changing-props"},{default:e(()=>[v]),_:1}),n("ul",null,[n("li",null,[a(t,{to:"#updating"},{default:e(()=>[_]),_:1})]),n("li",null,[a(t,{to:"#reacting"},{default:e(()=>[q]),_:1})])])]),n("li",null,[a(t,{to:"#responsibility"},{default:e(()=>[x]),_:1})])])]),j,n("p",null,[M,n("a",T,[O,a(c)]),C]),D],64)}var L=u(d,[["render",S]]);export{L as default};
