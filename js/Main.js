let mainSwitcher, projectsSwitcher;
let list;
let detailsToggles = {};

let badgeDescriptions = {
  js: 'Written in Javascript',
  py: 'Written in Python',
  app: 'This is an Application',
  util: 'This is an utility package',
  algo: 'This project features algorithms',
  prog: 'This project is in progress',
  old: 'This project is old'
};

let projectDetails = {
  walkers: 'Mini app where you can watch blobs search for food and escape predators.',
  roverSoft: 'GUI app made to control a Raspberry Pi powered rover.',
  domi: 'Set of classes and aliases for building single page apps.',
  shp: 'HTML Preprocessor for static files.',
  pluginable: 'Framework for creating modular apps. Utilizes multiprocessing and features event based communication.',
  tkiw: 'TkInter wrapper package. Used to build GUI of desktop apps.',
  cis: 'TCP Communication protocol. Primarily designed for the rover project.',
  pathfinder: 'Showcase of a pathfinding algorithm.',
};

let main = () => {
  mainSwitcher = new Switcher();
  mainSwitcher.addSection(new Section('landing', $id('Landing')));
  mainSwitcher.addSection(new Section('projects', $id('Projects')));
  mainSwitcher.goto('landing');

  list = $id('IndexListing');
  projectsSwitcher = new Switcher();
  projectsSwitcher.addSection(new Section('index', $id('Index')));
  addProject('Walking Blobs', 'walkers', $id('Walkers'), ['app', 'algo', 'js']);
  addProject('The Rover Software', 'roverSoft', $id('RoverSoft'), ['app', 'prog', 'py']);
  addProject('Domi.js Package', 'domi', $id('Domi'), ['util', 'js']);
  addProject('Static HTML Preprocessor', 'shp', $id('SHP'), ['util', 'py', 'js']);
  addProject('Pluginable Package', 'pluginable', $id('Pluginable'), ['util', 'py']);
  addProject('TkInter Wrapper Package', 'tkiw', $id('TkInterWrapper'), ['util', 'prog', 'py']);
  addProject('CIS Protocol', 'cis', $id('CIS'), ['util', 'py']);
  addProject('Maze Pathfinder', 'pathfinder', $id('Pathfinder'), ['algo', 'old', 'py']);

  let clear = $create('div');
  clear.classList.add('Clear');
  list.appendChild(clear);
  projectsSwitcher.goto('index');
};


let addProject = (name, id, element, badges=[]) => {
  projectsSwitcher.addSection(new Section(id, element));

  let shp = `
  $div[.Element onclick 'openDetails("${id}");'] {
    $div[.Left] {
      $div [.Name] {
        ${name}
      }
      $div[.Description] {
        $div {${projectDetails[id]}}
        $button[onclick 'gotoProject("${id}");'] {Read more}
      }
    }
    $div[.Badges] {
  `; for (let badge of badges) { shp += `
      $div[.Badge title '${badgeDescriptions[badge]}'] {
        $img[src img/badges/${badge}.png alt '${badgeDescriptions[badge]}']
      }
  `; } shp += `
    }
    $div[.Clear]
  }`;
  let builder = new ShpCompiler();
  let entry = builder.compile(shp)[0];
  list.appendChild(entry);

  let detailsToggle = new DomStateToggle(entry, false, {
    trueClass: 'DetailsOn', falseClass: 'DetailsOff'});
  detailsToggles[id] = detailsToggle;

  let back = $create('button');
  back.classList.add('Back');
  element.querySelector('.Content').appendChild(back);
  back.onclick = () => {gotoProject('index');}
  back.innerText = 'X';
}

let gotoProject = (id) => {
  let next = projectsSwitcher.sections[id].section;
  if (window.current != undefined) {
    window.current.classList.add('Hidden');
  }
  next.classList.add('Hidden');
  setTimeout((id) => {
    projectsSwitcher.goto(id);
  }, 500, id);
  setTimeout((next) => {
    if (window.current != undefined) window.current.classList.remove('Hidden');
    next.classList.remove('Hidden');
    window.current = next;
  }, 550, next);
}

let goto = (to) => {
  if (to != 'Landing' && to != 'Projects') {
    console.log('Error');
    return;
  }
  let from = (to == 'Landing') ? 'Projects' : 'Landing';
  $id(from).classList.add('SlideOut');
  $id(to).classList.add('Hidden');
  setTimeout(() => {
    mainSwitcher.goto(to.toLowerCase());
  }, 450);
  setTimeout(() => {
    $id(to).classList.remove('Hidden');
    $id(from).classList.remove('SlideOut');
  }, 550);
};

let openDetails = (id) => {
  for (let toggle of Object.values(detailsToggles)) {
    toggle.off();
  }
  detailsToggles[id].on();
};
