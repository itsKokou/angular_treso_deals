
export namespace NexTransition {
    export type NexTransitionEnum = 'CHANGE_PASSWORD' | 'HOME' | 'ACCEPT_CGU' | 'ACTIVATION';
    export const NexTransitionEnum = {
        ChangePassword: 'CHANGE_PASSWORD' as NexTransitionEnum,
        Home: 'HOME' as NexTransitionEnum,
        AcceptCgu: 'ACCEPT_CGU' as NexTransitionEnum,
        Activation: 'ACTIVATION' as NexTransitionEnum
    };
}