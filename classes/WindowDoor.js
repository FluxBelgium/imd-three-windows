import {
    BoxGeometry,
    Group,
    Mesh,
    MeshNormalMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
} from "three";
import { scene } from "../main";

export class WindowDoor {
    constructor(width = 1, height = 1, flip = false) {
        this.width = width;
        this.height = height;

        // Measurements.
        this.frameThickness = 0.05;
        this.frameDepth = 0.05;
        this.glassDepth = 0.02;

        // Group.
        this.group = new Group();
        // Flip if specified.
        if(flip) {
            this.group.scale.x = -1;
        }

        // Material.
        this.metalMaterial = new MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.5 });
        this.glassMaterial = new MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.25, metalness: 1, transparent: true, opacity: 0.2 });

        // Geometry.
        this.placeholderGeometry = new BoxGeometry();

        // Parts.
        this.frameTop = new Mesh(this.placeholderGeometry, this.metalMaterial);
        this.frameBottom = new Mesh(
            this.placeholderGeometry,
            this.metalMaterial
        );
        this.frameLeft = new Mesh(this.placeholderGeometry, this.metalMaterial);
        this.frameRight = new Mesh(
            this.placeholderGeometry,
            this.metalMaterial
        );
        this.glass = new Mesh(this.placeholderGeometry, this.glassMaterial);

        this.group.add(
            this.frameTop,
            this.frameBottom,
            this.frameLeft,
            this.frameRight,
            this.glass
        );

        this.add();
        this.setSize(this.width, this.height);
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
    setSize(width, height) {
        this.width = width;
        this.height = height;

        // Set scales.
        this.frameTop.scale.set(width, this.frameThickness, this.frameDepth);
        this.frameBottom.scale.set(width, this.frameThickness, this.frameDepth);
        this.frameLeft.scale.set(
            this.frameThickness,
            height - this.frameThickness * 2,
            this.frameDepth
        );
        this.frameRight.scale.set(
            this.frameThickness,
            height - this.frameThickness * 2,
            this.frameDepth
        );
        this.glass.scale.set(
            width - this.frameThickness * 2,
            height - this.frameThickness * 2,
            this.glassDepth
        );

        // Reposition parts.
        this.frameBottom.position.y = -height / 2 + this.frameThickness / 2;
        this.frameBottom.position.x = width / 2;
        this.frameTop.position.y = height / 2 - this.frameThickness / 2;
        this.frameTop.position.x = width / 2;
        this.frameLeft.position.x = width - this.frameThickness / 2;
        this.frameRight.position.x = this.frameThickness / 2;
        this.glass.position.x = width / 2
    }

    // Set group position.
    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    // Set window rotation.
    setRotation(radians) {
        this.group.rotation.y = radians * this.group.scale.x;
    }
}
