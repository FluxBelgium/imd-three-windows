import {
    BoxGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    RepeatWrapping,
    Vector2,
} from "three";
import { scene, textureLoader } from "../main";
import { CSG } from "three-csg-ts";

export class WindowWall {
    constructor(width = 2, height = 2, holeWidth = 1, holeHeight = 1) {
        this.width = width;
        this.height = height;
        this.holeWidth = holeWidth;
        this.holeHeight = holeHeight;

        // Measurements.
        this.wallDepth = 0.15;

        // Group.
        this.group = new Group();

        // Material.
        this.wallMaterial = new MeshStandardMaterial({
            color: "#FFFFFF",
            roughness: 1,
            map: textureLoader.load("./textures/wall-color.jpg"),
        });
        this.wallMaterial.map.anisotropy = 16;
        this.wallMaterial.map.wrapS = RepeatWrapping;
        this.wallMaterial.map.wrapT = RepeatWrapping;
        this.holeMaterial = new MeshBasicMaterial({
            wireframe: true,
            color: "blue",
        });

        // Geometry.
        this.placeholderGeometry = new BoxGeometry();

        // Parts.
        this.wall = new Mesh(this.placeholderGeometry, this.wallMaterial);
        this.hole = new Mesh(this.placeholderGeometry, this.holeMaterial);

        this.hole.visible = false;

        this.group.add(this.wall, this.hole);

        // Shadows.
        this.wall.castShadow = true;
        this.wall.receiveShadow = true;

        this.add();
        this.setSize(this.width, this.height, this.holeWidth, this.holeHeight);
    }

    // Add to main scene.
    add() {
        scene.add(this.group);
    }

    // Remove from main scene.
    remove() {
        scene.remove(this.group);
    }

    // Resize the window frame.
    setSize(width, height, holeWidth, holeHeight) {
        this.width = width;
        this.height = height;
        this.holeWidth = holeWidth;
        this.holeHeight = holeHeight;

        // Set scales.
        this.wall.scale.set(this.width, this.height, this.wallDepth);
        this.hole.scale.set(
            this.holeWidth,
            this.holeHeight + 0.01,
            this.wallDepth
        );

        // Set positions.
        this.hole.position.y = -0.005;

        // Cut hole from wall.
        this.wall.updateMatrix();
        this.hole.updateMatrix();

        const cutWall = CSG.subtract(this.wall, this.hole);
        this.wall.geometry.dispose();
        this.wall.geometry = cutWall.geometry;
        
        // Update texture repeats.
        this.wallMaterial.map.repeat.set(this.width, this.height);
    }

    // Set group position.
    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }
}
