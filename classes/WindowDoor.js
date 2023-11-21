import { BoxGeometry, Color, Group, Mesh, MeshStandardMaterial } from "three";
import { gltfLoader, scene } from "../main";

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
        if (flip) {
            this.group.scale.x = -1;
        }

        // Material.
        this.metalMaterial = new MeshStandardMaterial({
            color: "#FFFFFF",
            roughness: 0.5,
        });
        this.glassMaterial = new MeshStandardMaterial({
            color: "#FFFFFF",
            roughness: 0.15,
            metalness: 1,
            transparent: true,
            opacity: 0.15,
        });

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

        this.handleBase = new Mesh(
            this.placeholderGeometry,
            this.metalMaterial
        );
        this.handleGrip = new Mesh(
            this.placeholderGeometry,
            this.metalMaterial
        );

        this.handleBase.visible = false;
        this.handleGrip.visible = false;

        this.group.add(
            this.frameTop,
            this.frameBottom,
            this.frameLeft,
            this.frameRight,
            this.glass,
            this.handleBase,
            this.handleGrip
        );

        // Shadows.
        this.frameTop.castShadow = true;
        this.frameBottom.castShadow = true;
        this.frameLeft.castShadow = true;
        this.frameRight.castShadow = true;
        this.handleBase.castShadow = true;
        this.handleGrip.castShadow = true;

        this.frameTop.receiveShadow = true;
        this.frameBottom.receiveShadow = true;
        this.frameLeft.receiveShadow = true;
        this.frameRight.receiveShadow = true;
        this.glass.receiveShadow = true;
        this.handleBase.receiveShadow = true;
        this.handleGrip.receiveShadow = true;

        // Load handle model.
        gltfLoader.load("./models/handle_compressed.glb", (gltf) => {
            this.handleBase.geometry = gltf.scene.children[0].geometry;
            this.handleGrip.geometry = gltf.scene.children[1].geometry;

            this.handleBase.visible = true;
            this.handleGrip.visible = true;
        });

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

        this.glass.position.x = width / 2;

        this.handleBase.position.x = width - this.frameThickness / 2;
        this.handleBase.position.z = this.frameDepth / 2;
        this.handleGrip.position.x = width - this.frameThickness / 2;
        this.handleGrip.position.z = this.frameDepth / 2;
    }

    // Set group position.
    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    // Set window rotation.
    setRotation(radians) {
        // Rotate window.
        this.group.rotation.y = -radians * this.group.scale.x;

        // Rotate grip.
        this.handleGrip.rotation.z = Math.max(-radians * 10, -Math.PI / 2);
    }

    // Set material color.
    setMaterialColor(color) {
        this.metalMaterial.color = new Color(color);
    }
}
