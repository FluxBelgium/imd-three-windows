import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { scene } from "../main";
import { WindowDoor } from "./WindowDoor";

export class WindowFrame {
    constructor(width = 1, height = 1) {
        this.width = width;
        this.height = height;

        // Measurements.
        this.frameThickness = 0.05;
        this.frameDepth = 0.1;
        this.sillHeight = 0.01;
        this.sillDepth = 0.2;

        // Group.
        this.group = new Group();

        // Material.
        this.metalMaterial = new MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.5 });

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
        this.windowSill = new Mesh(
            this.placeholderGeometry,
            this.metalMaterial
        );

        this.group.add(
            this.frameTop,
            this.frameBottom,
            this.frameLeft,
            this.frameRight,
            this.windowSill
        );

        this.doorLeft = new WindowDoor(
            (width - this.frameThickness * 2) / 2,
            height - this.frameThickness * 2
        );
        this.doorRight = new WindowDoor(
            (width - this.frameThickness * 2) / 2,
            height - this.frameThickness * 2,
            true
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
        this.windowSill.scale.set(width, this.sillHeight, this.sillDepth);

        // Reposition parts.
        this.windowSill.position.y = -height / 2 - this.sillHeight / 2;
        this.frameBottom.position.y = -height / 2 + this.frameThickness / 2;
        this.frameTop.position.y = height / 2 - this.frameThickness / 2;
        this.frameLeft.position.x = -width / 2 + this.frameThickness / 2;
        this.frameRight.position.x = width / 2 - this.frameThickness / 2;

        // Update window doors.
        this.doorLeft.setSize(
            (width - this.frameThickness * 2) / 2,
            height - this.frameThickness * 2
        );
        this.doorRight.setSize(
            (width - this.frameThickness * 2) / 2,
            height - this.frameThickness * 2
        );
        this.doorLeft.setPosition(-(width - this.frameThickness * 2) / 2, 0, 0);
        this.doorRight.setPosition((width - this.frameThickness * 2) / 2, 0, 0);
    }

    // Set window doors rotation.
    setRotation(radians) {
        this.doorLeft.setRotation(radians);
        this.doorRight.setRotation(radians);
    }
}
