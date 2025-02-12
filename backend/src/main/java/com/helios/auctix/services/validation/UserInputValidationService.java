package com.helios.auctix.services.validation;

import com.helios.auctix.services.ResponseDTO;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserInputValidationService {

    public static ResponseDTO validateEmail(String email){
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        if(matcher.matches()){
            return new ResponseDTO("Email is valied.",true);
        }
        else{
            return new ResponseDTO("Email is invalied.",false);
        }
    }

    public static ResponseDTO validatePassword(String plainPassword){
        // Check length
        if (plainPassword.length()>42 || plainPassword.length()<6) {
            return new ResponseDTO("Password length should be 6-42 characters long",false);
        }

        // Check for at least one capital letter
        String capitalLetterRegex = ".*[A-Z].*";
        Pattern capitalLetterPattern = Pattern.compile(capitalLetterRegex);
        Matcher capitalLetterMatcher = capitalLetterPattern.matcher(plainPassword);
        if (!capitalLetterMatcher.matches()) {
            return new ResponseDTO("Password must contains at least 1 capital letter.",false);
        }

        // Check for at least one simple letter
        String simpleLetterRegex = ".*[a-z].*";
        Pattern simpleLetterPattern = Pattern.compile(simpleLetterRegex);
        Matcher simpleLetterMatcher = simpleLetterPattern.matcher(plainPassword);
        if (!simpleLetterMatcher.matches()) {
            return new ResponseDTO("Password must contains at least 1 simple letter.",false);
        }

        // Check for at least one special character
        String specialCharRegex = ".*[!@#$%^&*(),.?\":{}|<>].*";
        Pattern specialCharPattern = Pattern.compile(specialCharRegex);
        Matcher specialCharMatcher = specialCharPattern.matcher(plainPassword);
        if (!specialCharMatcher.matches()) {
            return new ResponseDTO("Password must contains at least 1 special character.",false);
        }

        // Check for invalid characters (only letters, numbers, and special characters are allowed)
        String invalidCharRegex = "^[A-Za-z0-9!@#$%^&*(),.?\":{}|<>]*$";
        Pattern invalidCharPattern = Pattern.compile(invalidCharRegex);
        Matcher invalidCharMatcher = invalidCharPattern.matcher(plainPassword);
        return  new ResponseDTO("Password is valied",true);

    }
}
