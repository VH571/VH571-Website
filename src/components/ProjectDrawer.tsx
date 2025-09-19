import { Button, CloseButton, Drawer, Portal, Box } from "@chakra-ui/react";
import { Project } from "@/models/project";

export default function ProjectPortal({
  project,
  containerRef,
  bodyRef,
}: {
  project: Project;
  containerRef?: React.RefObject<HTMLElement> | null;
  bodyRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <Box>
      {containerRef && (
        <Portal container={containerRef ?? ""}>
          <Drawer.Backdrop />
    <Drawer.Positioner position="absolute" w="100%" padding = {"20px"}>
            <Drawer.Content
  w="95%"
  bg={"var(--color-seashell)"}
  mx={"auto"}
  minH={"320px"}
  maxH={"940px"}
  minW={"320px"}
  maxW={"940px"}
  ref={bodyRef}
  overflow={"scroll"}
>
  <style>
    {`
      .rv-container { padding: 12px 16px 20px; }
      .rv-header { display:flex; flex-direction:column; gap:6px; padding: 4px 0 12px; }
      .rv-title { margin: 0; font-size: 1.5rem; line-height: 1.2; }
      .rv-subtitle { margin: 0; font-size: 0.95rem; opacity: 0.8; }
      .rv-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 16px;
      }
      @media (max-width: 760px) {
        .rv-grid { grid-template-columns: 1fr; }
      }
      .rv-section { background: white; border-radius: 10px; padding: 14px; box-shadow: 0 1px 0 rgba(0,0,0,0.03); }
      .rv-section h3 { margin: 0 0 10px; font-size: 1rem; letter-spacing: .2px; }
      .rv-desc { margin: 0; line-height: 1.55; }
      .rv-chips { display:flex; flex-wrap:wrap; gap: 8px; }
      .rv-chip {
        font-size: 12px; padding: 6px 10px; border-radius: 999px;
        background: #f4f4f4; border: 1px solid #e8e8e8;
        white-space: nowrap;
      }
      .rv-list { margin: 0; padding-left: 18px; display: grid; gap: 6px; }
      .rv-links { display:flex; flex-wrap:wrap; gap: 8px; }
      .rv-link {
        display:inline-flex; align-items:center; gap: 6px;
        padding: 8px 10px; border-radius: 8px; background:#f8f8f8;
        border: 1px solid #ececec; font-size: 0.9rem; text-decoration:none;
      }
      .rv-link:hover { background:#f1f1f1; }
      .rv-screens {
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 10px;
      }
      .rv-thumbWrap { position: relative; overflow: hidden; border-radius: 10px; border: 1px solid #eee; }
      .rv-thumb {
        width: 100%; height: 140px; object-fit: cover; display: block;
        background: #fafafa;
      }
      .rv-thumbCap {
        position:absolute; left:0; right:0; bottom:0;
        padding: 6px 8px; font-size: 11px; background: linear-gradient(transparent, rgba(0,0,0,0.55));
        color: white; text-shadow: 0 1px 1px rgba(0,0,0,0.7);
      }
      .rv-footerActions { display:flex; gap: 8px; margin-right: auto; flex-wrap: wrap; }
      .rv-empty { opacity: 0.6; font-style: italic; }
    `}
  </style>

  <Drawer.Header>
    <div className="rv-container rv-header">
      <Drawer.Title className="rv-title">{project.name}</Drawer.Title>
      <p className="rv-subtitle">{project.role}</p>
    </div>
  </Drawer.Header>

  <Drawer.Body>
    <div className="rv-container rv-grid">
      {/* Left column: details */}
      <section className="rv-section" aria-labelledby="about">
        <h3 id="about">About</h3>
        <p className="rv-desc">
          {project.description?.trim() || <span className="rv-empty">No description provided.</span>}
        </p>
      </section>

      {/* Right column: quick facts */}
      <section className="rv-section" aria-labelledby="quickfacts">
        <h3 id="quickfacts">Tech</h3>
        {project.tech?.length ? (
          <div className="rv-chips">
            {project.tech.map((t, i) => (
              <span key={`${t}-${i}`} className="rv-chip">{t}</span>
            ))}
          </div>
        ) : (
          <div className="rv-empty">No technologies listed.</div>
        )}
      </section>

      {/* Achievements */}
      <section className="rv-section" aria-labelledby="achievements">
        <h3 id="achievements">Key Achievements</h3>
        {project.achievements?.length ? (
          <ul className="rv-list">
            {project.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        ) : (
          <div className="rv-empty">No achievements added yet.</div>
        )}
      </section>

      {/* Links */}
      <section className="rv-section" aria-labelledby="links">
        <h3 id="links">Links</h3>
        {project.links?.length ? (
          <div className="rv-links">
            {project.links.map((l, i) => {
              const label = l.label?.trim() || new URL(l.url).hostname.replace(/^www\./, "");
              return (
                <a
                    key={`${l.url}-${i}`}
                    className="rv-link"
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${label} in a new tab`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z" />
                    </svg>
                    {label}
                </a>
              );
            })}
          </div>
        ) : (
          <div className="rv-empty">No external links.</div>
        )}
      </section>

      {/* Screenshots */}
      <section className="rv-section" aria-labelledby="screenshots">
        <h3 id="screenshots">Screenshots</h3>
        {project.screenshots?.length ? (
          <div className="rv-screens">
            {project.screenshots.map((img, i) => (
              <a
                key={`${img.url}-${i}`}
                className="rv-thumbWrap"
                href={img.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open screenshot ${i + 1} in a new tab`}
                title={img.alt || `Screenshot ${i + 1}`}
              >
                <img
                  className="rv-thumb"
                  src={img.url}
                  alt={img.alt || `Screenshot ${i + 1}`}
                  width={img.width}
                  height={img.height}
                  loading="lazy"
                />
                {img.alt ? <div className="rv-thumbCap">{img.alt}</div> : null}
              </a>
            ))}
          </div>
        ) : (
          <div className="rv-empty">No screenshots uploaded.</div>
        )}
      </section>
    </div>
  </Drawer.Body>

  <Drawer.Footer>
    {/* Optional: promote primary link(s) into the footer for quick access */}
    <div className="rv-footerActions">
      {project.links?.slice(0, 2).map((l, i) => {
        const label = l.label?.trim() || new URL(l.url).hostname.replace(/^www\./, "");
        return (
          <Button asChild key={`footer-${l.url}-${i}`} variant="ghost">
            <a href={l.url} target="_blank" rel="noopener noreferrer">{label}</a>
          </Button>
        );
      })}
    </div>

    {/* keep your original actions */}
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </Drawer.Footer>

  <Drawer.CloseTrigger asChild>
    <CloseButton size="sm" />
  </Drawer.CloseTrigger>
</Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      )}
    </Box>
  );
}
