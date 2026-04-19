import { Header } from "@/components/layout/Header";
import { SiteNav } from "@/components/layout/SiteNav";
import { Figure } from "@/components/viz/Figure";
import { EmbeddingSpaceViz } from "@/components/viz/EmbeddingSpaceViz";
import { CrossLingualViz } from "@/components/viz/CrossLingualViz";
import { CosineSimilarityViz } from "@/components/viz/CosineSimilarityViz";
import { TranslationAsNavigationViz } from "@/components/viz/TranslationAsNavigationViz";
import { DriftWalkViz } from "@/components/viz/DriftWalkViz";
import { TranslationPlayground } from "@/components/playground/TranslationPlayground";
import { ExplainerHero } from "@/components/explainer/ExplainerHero";
import Link from "next/link";

export const metadata = {
  title: "How translation actually works — Lost in Translation",
  description:
    "A visual explanation of embedding spaces, cosine similarity, and why meaning drifts when you translate a phrase through many languages.",
};

export default function ExplainerPage() {
  return (
    <main className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Header rightSlot={<SiteNav current="explainer" />} />

      {/* Hero */}
      <section className="mt-10 mb-16">
        <ExplainerHero />
      </section>

      {/* Article body — narrow column with breakout figures */}
      <article className="prose-lost mx-auto max-w-2xl text-dark-200 leading-relaxed">
        <p className="lead text-xl text-dark-100 leading-snug mb-10">
          If you&apos;ve ever played the playground game <em>Telephone</em>, you know what
          happens. A message whispered from ear to ear arrives at the end of the line
          transformed — sometimes comically, sometimes chillingly. The same thing happens
          when you push a phrase through a chain of translators. But <em>why</em>?
        </p>

        <p className="mb-4">
          The usual answer — &ldquo;each translation loses something&rdquo; — is true but
          uninformative. It doesn&apos;t tell you <em>what</em> is lost, or <em>how</em>, or
          why some phrases survive the journey remarkably well while others dissolve into
          paraphrase within two hops. To answer those questions we have to look at what a
          modern language model <em>actually does</em> when it translates.
        </p>

        <p className="mb-4">
          It doesn&apos;t match words against a dictionary. It doesn&apos;t parse grammar
          into trees. It does something stranger: it turns every piece of language into a
          point in a high-dimensional space, and translation becomes a kind of navigation
          through that space.
        </p>

        <p>
          This article explains that space, how it&apos;s built, and why — once you can see
          it — the drift in our game becomes almost inevitable.
        </p>

        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionHeading number="1" title="Words, but as coordinates" />

        <p className="mb-4">
          The first thing to understand is that modern models don&apos;t think of words as
          strings. Internally, every word — every subword fragment, actually — is a{" "}
          <strong className="text-dark-100">vector</strong>: a list of numbers, typically
          around 1,536 of them. These vectors live in a space with one dimension per
          number. You can&apos;t draw that space. Nobody can. But you can project it down
          to two dimensions and see the shape.
        </p>

        <p>
          Here&apos;s a projection of a few dozen English words. Hover to see each word&apos;s
          nearest semantic neighbours:
        </p>

        <Figure
          number={1}
          title="English words projected into a meaning space"
          breakout
          caption={
            <>
              Each point is a word. Proximity is semantic similarity: words with related
              meanings land near each other, forming loose clusters. This is a 2D
              projection of a much larger space — the real embeddings have 1,536 dimensions
              — but the clustering survives the squashing.
            </>
          }
        >
          <EmbeddingSpaceViz />
        </Figure>

        <p className="mb-4">
          Notice that the model was never told <em>&ldquo;dog&rdquo; and &ldquo;wolf&rdquo;
          are similar</em>. Nobody labelled these clusters. The geometry emerged during
          training, as a side effect of the model learning to predict which word comes
          next in billions of sentences. Words that appear in similar contexts end up with
          similar vectors. Meaning, it turns out, leaks out of context.
        </p>

        <p>
          This is the insight Mikolov&apos;s team made famous in 2013 with{" "}
          <em>word2vec</em>, but modern transformers take it much further: they embed not
          just words but entire sentences, paragraphs, and — crucially for us — passages
          in any language the model has ever seen.
        </p>

        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionHeading number="2" title="The multilingual surprise" />

        <p className="mb-4">
          Here&apos;s where things get properly strange. When a multilingual model is
          trained on text from many languages, it <em>doesn&apos;t</em> build a separate
          space for each language. It builds one shared space, and words that mean the
          same thing across languages end up in roughly the same region.
        </p>

        <p>
          &ldquo;Dog&rdquo; sits near 犬 sits near <em>perro</em> sits near{" "}
          <em>chien</em>. All of them, effectively, share coordinates:
        </p>

        <Figure
          number={2}
          title="The same concept across languages clusters together"
          breakout
          caption={
            <>
              English, Spanish, French, German, and Japanese words for the same concept
              cluster within tight regions of the space. Dashed lines mark each concept&apos;s
              centre. Toggle the bonds off to see how naturally the translations interleave
              without them.
            </>
          }
        >
          <CrossLingualViz />
        </Figure>

        <p className="mb-4">
          This is not a trick. Nobody trained the model to put translations near each
          other. It emerges because words that mean the same thing tend to appear in
          statistically similar contexts across languages — paired in parallel corpora,
          surrounded by similar neighbours, used for similar purposes. The training
          objective quietly discovers that <em>dog</em>, <em>perro</em>, and <em>chien</em>{" "}
          are really just three labels for the same location in meaning-space.
        </p>

        <p>
          Once you accept that, translation stops being a dictionary lookup and starts
          being a kind of <strong className="text-dark-100">geometry</strong>.
        </p>

        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionHeading number="3" title="Measuring closeness" />

        <p className="mb-4">
          If meaning is geometry, we need a way to measure distance. The standard tool
          is <strong className="text-dark-100">cosine similarity</strong>: the cosine of
          the angle between two vectors when you draw them from the origin.
        </p>

        <p>
          It&apos;s the right choice because embedding vectors encode direction more than
          magnitude — two related ideas can have very different &ldquo;lengths&rdquo; but
          point roughly the same way. Cosine asks:{" "}
          <em>are these two arrows headed in the same direction?</em>
        </p>

        <Figure
          number={3}
          title="Cosine similarity, interactively"
          caption={
            <>
              Drag the slider to change the angle. The cosine value collapses the full
              angle into a single number between <span className="tnum">-1</span>{" "}
              (opposite) and <span className="tnum">1</span> (identical direction). The
              preset buttons show approximate real-world angles — <code>king</code> vs{" "}
              <code>queen</code> is a small angle; <code>happy</code> vs <code>blue</code>{" "}
              is nearly a right angle.
            </>
          }
        >
          <CosineSimilarityViz />
        </Figure>

        <p className="mb-4">
          In real embedding spaces, cosines rarely go below zero. Most pairs of English
          sentences land somewhere in the{" "}
          <span className="tnum text-dark-100">0.3</span>–
          <span className="tnum text-dark-100">1.0</span> range, because nearly all
          natural text shares <em>some</em> structural features. That&apos;s why{" "}
          <code className="text-crimson-300">Lost in Translation</code> maps cosine{" "}
          <span className="tnum">0.3</span>–<span className="tnum">1.0</span> onto
          retention <span className="tnum">0</span>–<span className="tnum">100%</span> —
          it&apos;s where the actually interesting variation happens.
        </p>

        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionHeading number="4" title="Translation as navigation" />

        <p className="mb-4">
          Now we can describe what actually happens when an LLM translates. Given a source
          phrase and a target language, it does something like this:
        </p>

        <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-dark-300 marker:text-crimson-400">
          <li>Embed the source phrase — find its point in meaning-space.</li>
          <li>
            Generate a sequence of tokens in the target language whose embedding lands as
            close as possible to that point.
          </li>
          <li>
            Among all valid completions, pick the one that also reads naturally to a native
            speaker.
          </li>
        </ol>

        <p>
          Step 2 is the interesting one. The model is effectively looking for the nearest
          neighbour in the target-language region of embedding space:
        </p>

        <Figure
          number={4}
          title="Translation as nearest-neighbour lookup"
          breakout
          caption={
            <>
              Pick a source word and a target language. The red arrow shows the short hop
              from source to the nearest target-language point. In the real, 1,536-dim
              space, the model has far more room to manoeuvre — but the geometric
              intuition holds: translation is a <em>short walk</em> within meaning-space.
            </>
          }
        >
          <TranslationAsNavigationViz />
        </Figure>

        <p>
          This is also why LLMs can translate between language pairs they were never
          explicitly trained on. As long as both languages sit in the same embedding
          space, a path exists.
        </p>

        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionHeading number="5" title="Why meaning drifts" />

        <p className="mb-4">
          So if translation is a short, principled walk across embedding space, why does
          our game produce such comical results?
        </p>

        <p className="mb-4">
          Three reasons compound:
        </p>

        <ul className="list-disc pl-6 mb-5 space-y-2 text-dark-300 marker:text-crimson-400">
          <li>
            <strong className="text-dark-100">Quantisation error.</strong> The target
            language doesn&apos;t have a word at exactly the right coordinates. The model
            picks the nearest available one — close, but not identical. That tiny error is
            baked into the next hop.
          </li>
          <li>
            <strong className="text-dark-100">Idiom collapse.</strong> Figurative phrases
            like <em>&ldquo;raining cats and dogs&rdquo;</em> have embeddings that encode
            the <em>idiomatic</em> meaning (heavy rain), but a literal translator may
            produce text that, when re-embedded, looks like the literal meaning (falling
            animals). The second model sees no idiom there — and the chain diverges.
          </li>
          <li>
            <strong className="text-dark-100">Register drift.</strong> Each language has
            its own conventions for formality, politeness, and rhythm. Honouring them
            nudges every translation a small step away from the original&apos;s emotional
            position, even when the literal meaning is preserved.
          </li>
        </ul>

        <p>
          Visualised, a chain of translations looks less like a clean pipeline and more
          like a drunken walk:
        </p>

        <Figure
          number={5}
          title="A drift walk through embedding space"
          breakout
          caption={
            <>
              Each dashed segment is a translation hop. The distance from the green origin
              halo grows with each step — slow at first, faster once an idiom gets
              collapsed. By the final step, the phrase is closer to &ldquo;creatures pour
              from the sky in a tempest&rdquo; than to &ldquo;it&apos;s raining cats and
              dogs&rdquo;. The meaning didn&apos;t disappear; it <em>moved</em>.
            </>
          }
        >
          <DriftWalkViz />
        </Figure>

        <p>
          This is the thing the retention score measures. Each hop gets a cosine against
          the <em>original</em> phrase. As the walker wanders further from origin, the
          cosine drops, and the retention percentage falls with it. The per-hop drift
          colours the connectors between cards: a green hop lost very little; a crimson
          hop took you somewhere new.
        </p>

        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionHeading number="6" title="Run your own" />

        <p className="mb-8">
          That&apos;s the theory. The tool below does all of this in real time: every
          translation embeds, every step gets scored, every hop colours its connector.
          Pick a phrase known to degrade (Shakespeare, idioms, puns), build a chain of
          languages, and watch the walk.
        </p>

        <div className="not-prose my-10 -mx-4 sm:-mx-6 lg:-mx-16">
          <TranslationPlayground
            variant="embedded"
            embedTitle="The translation chain"
            showResults
            initialPhrase="It's raining cats and dogs."
            initialTourCodes={["en", "ja", "ar", "el", "sw", "en"]}
            initialMode="natural"
          />
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg btn-primary text-sm font-semibold"
          >
            Open the full demo →
          </Link>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionHeading number="7" title="What this doesn't explain" />

        <p className="mb-4">
          Two honest caveats, in the interest of not hand-waving:
        </p>

        <p className="mb-4">
          <strong className="text-dark-100">The 2D projections are lies.</strong> They
          preserve cluster structure but lose the real geometry. Two points that look
          adjacent in 2D may be far apart in the full space, and vice versa. The
          intuitions still hold, but the exact distances don&apos;t transfer.
        </p>

        <p className="mb-4">
          <strong className="text-dark-100">Embeddings aren&apos;t the whole translation
          story.</strong> Modern LLMs use attention and causal generation, not just
          nearest-neighbour lookup. The &ldquo;translation is navigation&rdquo; framing is
          a useful metaphor for <em>why</em> cross-lingual translation is possible, not a
          complete account of the algorithm. The real mechanics involve predicting one
          subword at a time, conditioned on both the source passage and every token
          produced so far.
        </p>

        <p className="mb-10">
          But for our purposes — understanding where retention comes from, why back-
          translation works, and why the drift in our game compounds the way it does —
          the geometric picture is enough. And once you have it, the tool stops being a
          toy and starts being a diagnostic.
        </p>

        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="mt-20 pt-10 border-t border-dark-700/40">
          <div className="text-[10px] uppercase tracking-wider text-crimson-400 font-semibold mb-2">
            Further reading
          </div>
          <ul className="space-y-1.5 text-sm text-dark-300">
            <li>
              <a
                className="text-dark-100 hover:text-crimson-300"
                href="https://platform.openai.com/docs/guides/embeddings"
                rel="noreferrer"
                target="_blank"
              >
                OpenAI&apos;s embedding guide
              </a>{" "}
              — practical API reference.
            </li>
            <li>
              <a
                className="text-dark-100 hover:text-crimson-300"
                href="https://arxiv.org/abs/1301.3781"
                rel="noreferrer"
                target="_blank"
              >
                Mikolov et al., 2013 (word2vec)
              </a>{" "}
              — the paper that made &ldquo;king − man + woman = queen&rdquo; famous.
            </li>
            <li>
              <a
                className="text-dark-100 hover:text-crimson-300"
                href="https://distill.pub/2016/misread-tsne/"
                rel="noreferrer"
                target="_blank"
              >
                How to Use t-SNE Effectively (Distill)
              </a>{" "}
              — a beautiful warning about trusting 2D projections.
            </li>
          </ul>
        </div>
      </article>

      <footer className="mt-20 pt-6 border-t border-dark-700/40 text-xs text-dark-500 flex items-center justify-between">
        <span>A showcase by Crane</span>
        <span>Deliberately built.</span>
      </footer>
    </main>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mt-16 mb-6 flex items-baseline gap-3">
      <span className="text-xs tnum uppercase tracking-wider text-crimson-400 font-semibold">
        {number}.
      </span>
      <h2 className="text-2xl font-semibold text-dark-100 leading-tight m-0">{title}</h2>
    </div>
  );
}
