import{r as o,o as i,c as l,b as n,d as a,w as c,F as u,e as s,a as t}from"./app.7a437beb.js";import{_ as r}from"./plugin-vue_export-helper.21dcd24c.js";const d={},k=n("h1",{id:"bindings",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#bindings","aria-hidden":"true"},"#"),s(" Bindings")],-1),b=s("Since we're not rendering the full DOM from our components - we make existing HTML interactive - but do want a way to easily update some HTML whenever our component's state changes, we've added "),m=n("code",null,"bindings",-1),h=s(" as a feature in Muban - heavily inspired by "),g={href:"https://knockoutjs.com/documentation/",target:"_blank",rel:"noopener noreferrer"},f=s("Knockout.js"),v=s("."),y=t(`<p>As a concept, a component follows this flow:</p><ol><li><p>In your <strong>template</strong>, &quot;tag&quot; all elements you want to use in your JS with <code>data-ref</code> attributes.</p></li><li><p>In your <strong>component definition</strong>, specify these <code>data-ref</code> id&#39;s, combined with the ref type you want to use them at (element, collection, component, etc).</p></li><li><p>Set up your initial <strong>component state</strong> using <code>ref</code> and <code>reactive</code> data structures.</p></li><li><p>Define your <strong>bindings</strong>, linking up the configured <code>refs</code> with your component state.</p></li><li><p>Whenever any of the component state <strong>updates</strong>, our bindings automatically update the HTML accordingly - or visa versa, when user interacts with the HTML, the component state updates.</p></li></ol><p>As an example, the important parts of this flow are:</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;toggle-expand&#39;</span><span class="token punctuation">,</span>
  props<span class="token operator">:</span> <span class="token punctuation">{</span>
    isExpanded<span class="token operator">:</span> propType<span class="token punctuation">.</span><span class="token builtin">boolean</span><span class="token punctuation">.</span><span class="token function">validate</span><span class="token punctuation">(</span><span class="token function">optional</span><span class="token punctuation">(</span>isBoolean<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  refs<span class="token operator">:</span> <span class="token punctuation">{</span>
    expandButton<span class="token operator">:</span> <span class="token function">refElement</span><span class="token punctuation">(</span><span class="token string">&#39;expand-button&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    expandContent<span class="token operator">:</span> <span class="token string">&#39;expand-content&#39;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">{</span> props<span class="token punctuation">,</span> refs <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">[</span>isExpanded<span class="token punctuation">,</span> toggleExpanded<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useToggle</span><span class="token punctuation">(</span>props<span class="token punctuation">.</span>isExpanded <span class="token operator">??</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> expandButtonLabel <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">getButtonLabel</span><span class="token punctuation">(</span>isExpanded<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> <span class="token punctuation">[</span>
      <span class="token function">bind</span><span class="token punctuation">(</span>refs<span class="token punctuation">.</span>expandButton<span class="token punctuation">,</span> <span class="token punctuation">{</span> text<span class="token operator">:</span> expandButtonLabel<span class="token punctuation">,</span> <span class="token function-variable function">click</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">toggleExpanded</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token function">bind</span><span class="token punctuation">(</span>refs<span class="token punctuation">.</span>self<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        css<span class="token operator">:</span> <span class="token punctuation">{</span> isExpanded <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><br><br><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><br><br><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><br><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div><p>The setup function should return an array of bindings, and the different binding helpers return those definitions.</p><p>All binding helpers should at least receive a ref item - the DOM element to bind to - and a set of properties. What those properties are, depends on the binding helper called, and the ref item you have passed.</p><h2 id="binding-helpers" tabindex="-1"><a class="header-anchor" href="#binding-helpers" aria-hidden="true">#</a> Binding helpers</h2><p>Let&#39;s go over the different binding helpers we have, <code>bind</code>, <code>bindMap</code> and <code>bindTemplate</code>.</p><h3 id="bind" tabindex="-1"><a class="header-anchor" href="#bind" aria-hidden="true">#</a> bind</h3><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token function">bind</span><span class="token punctuation">(</span>anyRef<span class="token punctuation">,</span> props<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>The <code>bind</code> helper works for all refs that you give it, and has 2 modes:</p><ol><li>For DOM refs, it will accept the DOM bindings</li><li>For Component refs, it will accept the exposed component props</li></ol><p>When passing a collection of either one, it will apply the bindings to all items in the collection.</p><h4 id="dom-bindings" tabindex="-1"><a class="header-anchor" href="#dom-bindings" aria-hidden="true">#</a> DOM bindings</h4><p>TODO</p><p><strong>Example</strong></p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// bind to a DOM element</span>
<span class="token function">bind</span><span class="token punctuation">(</span>refs<span class="token punctuation">.</span>button<span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token function-variable function">click</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;clicked&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  text<span class="token operator">:</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> isLoading<span class="token punctuation">.</span>value <span class="token operator">?</span> <span class="token string">&#39;loading...&#39;</span> <span class="token operator">:</span> <span class="token string">&#39;submit&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`,17),x={class:"custom-container tip"},_=n("p",{class:"custom-container-title"},"API",-1),w=s("Read more on the "),M=s("DOM bindings API"),T=s(" page."),I=t(`<h4 id="component-bindings" tabindex="-1"><a class="header-anchor" href="#component-bindings" aria-hidden="true">#</a> Component bindings</h4><p>TODO</p><p><strong>Example</strong></p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// bind to a component, setting props or passing callbacks</span>
<span class="token function">bind</span><span class="token punctuation">(</span>refs<span class="token punctuation">.</span>filter<span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token comment">// selectedIndex is the name of the component prop, but also a reactive \`ref\`</span>
  selectedIndex<span class="token punctuation">,</span>
  <span class="token function-variable function">onChange</span><span class="token operator">:</span> <span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNewValue</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token comment">// You can also have access to the allowed bindings of the ref component using the special $element key</span>
  <span class="token comment">// Allowed bindings for component refs are: &#39;css&#39; | &#39;style&#39; | &#39;attr&#39; | &#39;event&#39;</span>
  $element<span class="token operator">:</span> <span class="token punctuation">{</span>
    css<span class="token operator">:</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token string-property property">&#39;is-active&#39;</span><span class="token operator">:</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div>`,4),L={class:"custom-container tip"},E=n("p",{class:"custom-container-title"},"API",-1),C=s("Read more on the "),D=s("Component bindings API"),O=s(" page."),B=t(`<h3 id="bindmap" tabindex="-1"><a class="header-anchor" href="#bindmap" aria-hidden="true">#</a> bindMap</h3><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token operator">...</span><span class="token function">bindMap</span><span class="token punctuation">(</span>refCollection<span class="token punctuation">,</span> <span class="token punctuation">(</span>ref<span class="token operator">?</span><span class="token punctuation">,</span> index<span class="token operator">?</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> props<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>The <code>bindMap</code> helper is specifically designed for ref collections that require slightly different binding values for each of the items within the collection.</p><p>Instead of accepting a props-object directly, it expects a function that returns those props, passing the individual item ref and its index in the collection as parameters.</p><p><strong>Example</strong></p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token comment">// bind to multiple dom elements</span>
<span class="token operator">...</span><span class="token function">bindMap</span><span class="token punctuation">(</span>refs<span class="token punctuation">.</span>items<span class="token punctuation">,</span> <span class="token punctuation">(</span>ref<span class="token punctuation">,</span> index<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// use the \`index\` in each individual binding</span>
  css<span class="token operator">:</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span> active<span class="token operator">:</span> index <span class="token operator">===</span> selectedIndex<span class="token punctuation">.</span>value <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token function-variable function">click</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span>selectedIndex<span class="token punctuation">.</span>value <span class="token operator">=</span> index<span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment">// bind to multiple components, setting props or passing callbacks</span>
<span class="token operator">...</span><span class="token function">bindMap</span><span class="token punctuation">(</span>refs<span class="token punctuation">.</span>slides<span class="token punctuation">,</span> <span class="token punctuation">(</span>ref<span class="token punctuation">,</span> index<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function-variable function">onChange</span><span class="token operator">:</span> <span class="token punctuation">(</span>isExpanded<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    activeIndex<span class="token punctuation">.</span>value <span class="token operator">=</span> isExpanded <span class="token operator">?</span> index <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token comment">// you could use \`ref.component?.props\` to access the individual component&#39;s props</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  expanded<span class="token operator">:</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> activeIndex<span class="token punctuation">.</span>value <span class="token operator">===</span> index<span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h3 id="bindtemplate" tabindex="-1"><a class="header-anchor" href="#bindtemplate" aria-hidden="true">#</a> bindTemplate</h3><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token function">bindTemplate</span><span class="token punctuation">(</span>refContainer<span class="token punctuation">,</span> onUpdate<span class="token punctuation">,</span> <span class="token punctuation">{</span> extractConfig<span class="token operator">?</span><span class="token punctuation">,</span> forceImmediateRender<span class="token operator">?</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>The <code>bindTemplate</code> is slightly different from the ones above, and is specifically designed to control the complete content of a DOM element by rendering templates client-side - getting as close to a SPA as we get in Muban.</p><p>Besides the container ref, have to pass an update function that returns the output to be placed in the DOM. Any observables that are referenced in the <code>onUpdate</code> functions will be watched, and when they change, the <code>onUpdate</code> will be called again to update the container with new HTML.</p><p>Optionally, you can pass some configuration to extract existing HTML from the server-rendered template, to populate your observable as initial data.</p><p>By default, muban will detect if an initial render is needed by checking if the container element is empty or not \u2013 if there is already HTML in it, the initial render is omitted. If you do want to do an initial render based on changed client-side information, you can pass <code>forceImmediateRender</code> as <code>true</code>.</p><div class="custom-container tip"><p class="custom-container-title">Note</p><p>Keep in mind that this binding completely removes and replaces the HTML on the page with what has been passed in your components.</p></div><p><strong>Example</strong></p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">return</span> <span class="token punctuation">[</span>
  
  <span class="token comment">// set up a template binding</span>
  <span class="token function">bindTemplate</span><span class="token punctuation">(</span>
    <span class="token comment">// control the contents of this container, clearing it on each re-render</span>
    refs<span class="token punctuation">.</span>productsContainer<span class="token punctuation">,</span>
    <span class="token comment">// render this template each time when the used observables update</span>
    <span class="token punctuation">(</span>onlyWatch<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> filteredProducts<span class="token punctuation">.</span>value<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>item <span class="token operator">=&gt;</span> <span class="token function">renderItem</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token comment">// optionally extract any exiting data from the HTML that was rendered on the server</span>
      extract<span class="token operator">:</span> <span class="token punctuation">{</span> config<span class="token operator">:</span> extractConfig<span class="token punctuation">,</span> <span class="token function-variable function">onData</span><span class="token operator">:</span> <span class="token punctuation">(</span>products<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> productData<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token operator">...</span>products<span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token comment">// by default muban will check if the container is empty from the server, and ignore updating</span>
      <span class="token comment">// it initially when it&#39;s not. Set this to true if you want to update the initial HTML anyway.</span>
      forceImmediateRender<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">)</span><span class="token punctuation">,</span>

<span class="token punctuation">]</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div>`,15),A={class:"custom-container tip"},H=n("p",{class:"custom-container-title"},"html-extract-data",-1),R=s("The data extraction makes use of the "),j={href:"https://www.npmjs.com/package/html-extract-data",target:"_blank",rel:"noopener noreferrer"},S=s("html-extract-data"),V=s(" npm module, check their documentation to all the possibilities and configuration."),N=n("h2",{id:"reactivity-tips",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#reactivity-tips","aria-hidden":"true"},"#"),s(" Reactivity tips")],-1),P=n("div",{class:"custom-container tip"},[n("p",{class:"custom-container-title"},"Reactive bindings"),n("p",null,"The binding are just set up once, and they rely on passing the reactive state to do their updates. So make sure to always pass a reference, never a primitive.")],-1);function F(W,q){const e=o("ExternalLinkIcon"),p=o("RouterLink");return i(),l(u,null,[k,n("p",null,[b,m,h,n("a",g,[f,a(e)]),v]),y,n("div",x,[_,n("p",null,[w,a(p,{to:"/api/bindings.html#dom-bindings"},{default:c(()=>[M]),_:1}),T])]),I,n("div",L,[E,n("p",null,[C,a(p,{to:"/api/bindings.html#component-bindings"},{default:c(()=>[D]),_:1}),O])]),B,n("div",A,[H,n("p",null,[R,n("a",j,[S,a(e)]),V])]),N,P],64)}var $=r(d,[["render",F]]);export{$ as default};
