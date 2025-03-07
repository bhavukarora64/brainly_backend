import JWT from 'jsonwebtoken';
import pool from './database'
import { Request, Response, NextFunction } from "express";
import {ResultSetHeader} from 'mysql2';
import { log } from 'console';

async function userAuth(req: Request, res: Response, next: NextFunction){
    const connection  = await pool.getConnection();
    try {
        const {authorization} = req.headers;

        if(!authorization){
            res.status(403).json({
                "success":0,
                "error":1,
                "message": "Please re-login !"
            })
        }else{
            const userId = JWT.verify(authorization.toString(), 'JWTSECRET');

            if(!userId){
                res.status(403).json({
                    "success":0,
                    "error":1,
                    "message": "JWT Expired ! Please Re-Login!"
                })
            }else{

                const [rows] =  await connection.execute<ResultSetHeader>(`SELECT userId, share, username FROM Users WHERE userId = '${userId}'`);
                if(Array.isArray(rows) && rows[0]){
                    req.body.userId = userId;
                    req.body.loggedInUser = rows[0]
                    next();
                }else{
                    res.status(403).json({
                        "success":0,
                        "error":1,
                        "message": "User does not exists, Please Register or re-login with correct credentials !"
                    })
                }
            }

        }
    }catch(e){
        res.status(411).json({
            "success":0,
            "error":1,
            "message": "Please Register or Re-login with correct credentials !"
        })
    }finally{
        connection.release();
    }
    
}

export default userAuth;