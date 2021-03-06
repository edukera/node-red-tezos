module.exports = function (RED) {
    'use stric';
    const { Tezos } = require('@taquito/taquito');
    var objectConstructor = ({}).constructor;
    function TezosConfirm(config) {
        RED.nodes.createNode(this, config);
        this.rpc = config.rpc;
        this.confirmation = config.confirmation;
        var node = this;
        node.on('input', function (msg) {
            if ('op' in msg.payload) {
                var op = msg.payload.op;
                Tezos.setProvider({ rpc: node.rpc });
                console.log(`Waiting for ${op.hash} to be confirmed...`);
                this.status({ fill: "blue", shape: "dot", text: "waiting for confirmation ..." });
                op.confirmation(1)
                    .then(() => {
                        console.log(`Operation injected: ${op.hash}`);
                        this.status({});
                        msg.payload = { res: true, op: op.hash };
                        node.send(msg);
                    })
                    // .catch(error => {
                    //     console.log(`Error: ${JSON.stringify(error, null, 2)}`);
                    //     this.status({ fill: "red", shape: "ring", text: "fail" });
                    //     msg.payload = { res: false };
                    //     node.send(msg);
                    // });
            } else {
                msg.payload = { res: false };
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("tezos-confirm", TezosConfirm);
}