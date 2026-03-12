document.documentElement.classList.add('js');

const navToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function renderProjectCard(project) {
  const demoButton = project.demo
    ? `<a class="btn btn-primary" href="${project.demo}" target="_blank" rel="noreferrer">Live Demo</a>`
    : '';

  return `
    <article class="project-card">
      <div class="project-media">
        <img src="${project.visual}" alt="${project.title} supporting visual" loading="lazy" decoding="async" />
      </div>
      <div class="project-body">
        <span class="project-status">${project.status}</span>
        <h3>${project.title}</h3>
        <p class="project-desc"><strong>What it is:</strong> ${project.description}</p>
        <p class="project-what"><strong>What it does:</strong> ${project.whatItDoes}</p>
        <ul class="stack" aria-label="Tech stack">
          ${project.stack.map((item) => `<li>${item}</li>`).join('')}
        </ul>
        <p class="visual-note">${project.visualType}</p>
        <div class="card-links">
          <a class="btn btn-secondary" href="${project.repo}" target="_blank" rel="noreferrer">GitHub Repo</a>
          ${demoButton}
          <a class="btn btn-ghost" href="${project.detailPage}">Case Study</a>
        </div>
      </div>
    </article>
  `;
}

function injectStructuredData(projects) {
  const scriptTag = document.getElementById('structured-data');
  if (!scriptTag) return;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Yumo Xu',
    url: 'https://yumorepos.github.io/portfolio/',
    sameAs: ['https://github.com/yumorepos', 'https://www.linkedin.com/in/'],
    knowsAbout: ['Travel Operations', 'Data Analytics', 'SQL', 'Python', 'Product Thinking'],
    workExample: projects.map((project) => ({
      '@type': 'SoftwareSourceCode',
      name: project.title,
      codeRepository: project.repo,
      programmingLanguage: project.stack.join(', '),
      description: project.description,
    })),
  };

  scriptTag.textContent = JSON.stringify(data);
}

async function loadProjects() {
  const target = document.getElementById('projects-grid');
  if (!target) return;

  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) throw new Error(`Failed project fetch: ${response.status}`);
    const projects = await response.json();
    target.innerHTML = projects.map(renderProjectCard).join('');
    injectStructuredData(projects);
  } catch (error) {
    console.error('Project rendering fallback:', error);
    const note = document.createElement('p');
    note.className = 'projects-note';
    note.textContent = 'Showing built-in project cards because live project data could not be loaded.';
    target.insertAdjacentElement('beforebegin', note);
  }
}

document.getElementById('current-year').textContent = new Date().getFullYear();
loadProjects();
