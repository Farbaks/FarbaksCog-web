


export class Signup {
    userName!: string;
    age!: number;
    gender!: 'male' | 'female';
    trainingType: 'default' | 'personalised' = 'default';
    password!: string;
}

export class Signin {
    userName!: string;
    password!: string;
}