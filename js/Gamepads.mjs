export default class Gamepads {

    constructor() {
        this.itemSize = 3;
        this.numItems = 2;
        this.identity = mat4.create();
        this.gamepads = [];
        this.myMatrix = mat4.create();
        this.gamepadMatTemp = mat4.create();
        this.gamepadMatHandle = mat4.create();

        window.addEventListener('gamepadconnected', () => this.connected());
        window.addEventListener('gamepaddisconnected', () => this.disconnected());
    }

    connected() {
        this.gamepads = navigator.getGamepads();
    }

    disconnected() {
        this.gamepads = navigator.getGamepads();
    }

    init(gl) {
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.75, 1.2,
            0.0, 0.75, 1.0
        ]), gl.STATIC_DRAW);
    }

    render(gl, shaderProgram, vrDisplay) {
        mat4.identity(this.myMatrix);
        mat4.identity(this.gamepadMatHandle);
        if (this.gamepads.length > 0) {
            mat4.fromRotationTranslation(this.myMatrix, this.gamepads[0].pose.orientation, this.gamepads[0].pose.position);
            mat4.multiply(this.myMatrix, vrDisplay.stageParameters.sittingToStandingTransform, this.myMatrix);

            mat4.identity(this.gamepadMatTemp);
            mat4.translate(this.gamepadMatTemp, this.gamepadMatTemp, [0, -0.5, -0.3]);
            mat4.rotateX(this.gamepadMatTemp, this.gamepadMatTemp, -Math.PI * 0.2);
            mat4.scale(this.gamepadMatTemp, this.gamepadMatTemp, [0.25, 0.25, 0.5]);
            mat4.multiply(this.gamepadMatHandle, this.myMatrix, this.gamepadMatTemp);
        }
        gl.uniformMatrix4fv(shaderProgram.modelMat, false, this.gamepadMatHandle);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(shaderProgram.vertPosAttr, this.itemSize, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINE_STRIP, 0, this.numItems);
    }
}