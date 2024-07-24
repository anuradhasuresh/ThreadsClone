"use server"

import { connectToDB } from "../mongoose"
import User from "../models/user.models";
import { revalidatePath } from "next/cache";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({
        userId,
        username,
        name,
        bio,
        image,
        path,
    } : Params) : Promise<void> {

    connectToDB();

    try {
        await User.findOneAndUpdate(
            { id: userId },
            { 
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboardedStatus: true,
            },
            { upsert: true }
        );
        if( path === '/profile/edit') {
            revalidatePath(path);
        }
    }
    catch (error: any) {
        throw new Error (`failed to create/ update user : ${error.message}`);
    }
}
export async function fetchUser (userId : String) {
    try {
        connectToDB();
        return await User
        .findOne({ id: userId})
        // .populate({
        //     path : 'communities',
        //     model : Community, 
        // })
    }
    catch (error: any) { 
        throw new Error(`failed to fetch user: ${error.message}`)
    }
}