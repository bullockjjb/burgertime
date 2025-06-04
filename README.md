# Accelevation Time

This repository contains the original C++/SFML Burgertime clone as well as a new lightweight HTML5 version called **Accelevation Time**. All original sprites and audio are preserved in `audio/` and `img/`.

## Play in your browser

Serve the `web/` folder with any local web server and then open `index.html` in your browser. For example:

```bash
python3 -m http.server --directory web
```

Navigate to <http://localhost:8000> and the game will begin automatically.

Controls:

- **Arrow keys** or **WASD** – Move
- **Space** – Use power-up
- **Esc** – Pause
- **Enter** – Resume from pause

The web version features five short levels with simplified enemy AI and rebranded text. Sprites and sounds remain under the original GPL-3.0 license from the Burgertime project.

The C++ source code and makefile remain for reference but are not needed to run the web build.

