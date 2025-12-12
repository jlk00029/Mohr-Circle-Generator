# Mohr's Circle Generator - Strain Visualization

A static website for visualizing strain transformations using Mohr's Circle. Built with pure HTML, CSS, and JavaScript - no dependencies required.

## Features

- **Interactive Input**: Enter strain components (εx, εy, γxy) in microstrain
- **Real-time Visualization**: Automatic calculation and plotting on submit
- **Accurate Calculations**: Follows standard textbook conventions (MIT OCW, eFunda)
- **Comprehensive Results**: Displays center, radius, principal strains, maximum shear, and principal angle
- **Professional Plot**: Canvas-based visualization with proper axes, labels, and legend
- **Responsive Design**: Works on desktop and mobile devices
- **Zero Dependencies**: Pure HTML/CSS/JavaScript - works offline

## Usage

### Online (GitHub Pages)
Visit the live demo: [https://jlk00029.github.io/Mohr-Circle-Generator/](https://jlk00029.github.io/Mohr-Circle-Generator/)

### Local
1. Clone this repository
2. Open `index.html` in any modern web browser
3. No build process or installation required!

## Plot Convention

The plot follows standard textbook conventions:
- **Horizontal axis**: Normal strain (ε)
- **Vertical axis**: γxy/2 (shear strain, positive upward)
- **Point X**: Located at (εx, γxy/2)
- **Point Y**: Located at (εy, -γxy/2)

## Calculations

The following formulas are implemented:

- **Center (Average Strain)**: εavg = (εx + εy) / 2
- **Radius**: R = √[((εx - εy)/2)² + (γxy/2)²]
- **Principal Strain 1**: ε1 = εavg + R
- **Principal Strain 2**: ε2 = εavg - R
- **Maximum Shear Strain**: γmax = 2R
- **Principal Angle**: tan(2θp) = γxy / (εx - εy)

## Files

- `index.html` - Main HTML structure with form and canvas
- `style.css` - Styling and responsive design
- `script.js` - Calculation logic and canvas plotting

## Example

Input:
- εx = 400 με
- εy = 200 με
- γxy = 150 με

Results:
- Center: 300.00 με
- Radius: 125.00 με
- ε1: 425.00 με
- ε2: 175.00 με
- γmax: 250.00 με
- θp: 18.43°

## References

This implementation follows conventions from:
- MIT OpenCourseWare (OCW)
- eFunda Engineering Fundamentals

## License

MIT License - Feel free to use and modify as needed.
