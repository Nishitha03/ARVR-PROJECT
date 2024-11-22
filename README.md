# Roman Artifacts Museum - Virtual Experience

A WebGL-based 3D virtual museum showcasing ancient Roman artifacts with interactive information panels and immersive first-person controls.

## Features

- Immersive 3D environment with realistic lighting and shadows
- Eight detailed Roman artifact models with historical information
- Interactive information panels that appear when approaching artifacts
- First-person controls for natural exploration
- Advanced visual effects including bloom and anti-aliasing
- Responsive design that adapts to different screen sizes
- Dynamic glass-like information panels with hover effects
- Real-time Wikipedia integration for artifact information

## Technical Requirements

- Modern web browser with WebGL 2.0 support
- Recommended browsers: Chrome, Firefox, Edge, Safari
- Stable internet connection for loading 3D models and textures
- Minimum screen resolution: 1024x768
- Graphics card with WebGL support

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd roman-artifacts-museum
```

2. Install dependencies:
```bash
npm install three
```

3. Set up a local server. You can use any of these methods:
   - Python: `python -m http.server`
   - Node.js: `npx serve`
   - VS Code: Use the Live Server extension

## Dependencies

- Three.js (version 0.161.0)
- Required Three.js modules:
  - GLTFLoader
  - PointerLockControls
  - EffectComposer
  - RenderPass
  - UnrealBloomPass
  - ShaderPass
  - FXAAShader
  - FontLoader
  - TextGeometry

## Controls

- **W** - Move forward
- **S** - Move backward
- **A** - Strafe left
- **D** - Strafe right
- **Mouse** - Look around
- **ESC** - Exit fullscreen/pointer lock
- **Click** - Enter pointer lock mode

## Features in Detail

### Lighting System
- Ambient lighting for base illumination
- Directional light with shadows
- Three point lights for dynamic lighting
- Spot light for focused illumination
- Hemisphere light for sky/ground color variation

### Information Panels
- Proximity-based activation
- Animated glass-like appearance
- Dynamic text rendering
- Responsive to user movement
- Wikipedia integration for real-time information

### Environmental Details
- Textured walls, floor, and ceiling
- Display tables for artifacts
- Collision detection
- Post-processing effects
  - Bloom for enhanced lighting
  - FXAA for smoother edges

## Artifacts

The museum features eight historically significant Roman artifacts:
1. Pugio (Roman dagger)
2. Statue of Romulus
3. Ancient Roman pottery
4. Roman coins
5. Galea (Roman helmet)
6. Bust of Julius Caesar
7. Claudia gens artifact
8. Roman sculpture bust

## Performance Optimization

- Efficient texture loading and management
- Optimized shadow mapping
- Level-of-detail management for 3D models
- Efficient post-processing pipeline
- Collision detection optimization

## Browser Support

Tested and supported in:
- Chrome 80+
- Firefox 76+
- Edge 80+
- Safari 13+

## Known Issues

1. High GPU usage in some browsers
2. Occasional texture loading delays on slow connections
3. Text rendering may vary across different systems

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- 3D Models: Various sources (see individual model credits)
- Textures: Custom created and public domain
- Information: Wikipedia API integration

### Video link to Our Project
(https://youtu.be/O-x9mUyg-FI)

## Support

For issues and feature requests, please use the GitHub issue tracker or contact nishithaanand2004@gmail.com

![roman_museum](https://github.com/user-attachments/assets/5c8dd537-c95a-416a-b801-dcdea3059899)
![roman_museum1](https://github.com/user-attachments/assets/d4e8ffa9-49a4-435a-a11c-d845924bb0ab)
![roman_museum2](https://github.com/user-attachments/assets/afe844c0-8fa7-4369-bbdb-291ac4890ba3)

