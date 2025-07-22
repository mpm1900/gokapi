package auth

import (
	"context"
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/mpm1900/gokapi/internal/db"

	"github.com/golang-jwt/jwt/v5"
)

func WithJWT(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("jwt")
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		jwt, err := ParseJWT(cookie.Value)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if err := ValidateJWTClaims(jwt); err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		next(w, r.Clone(context.WithValue(r.Context(), "jwt", jwt)))
	}
}

func getKey(token *jwt.Token) (any, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))
	return secret, nil
}

func ParseJWT(tokenString string) (jwt.MapClaims, error) {
	options := jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()})
	token, err := jwt.Parse(tokenString, getKey, options)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("failed to parse claims")
	}

	return claims, nil
}

func ValidateJWTClaims(claims jwt.MapClaims) error {
	return jwt.NewValidator().Validate(claims)
}

func CreateJWT(user *db.User) (string, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))
	exp := time.Now().Add(time.Minute * 5).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    user.ID,
		"email": user.Email,
		"exp":   exp,
	})
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func newJwtCookie(token string, exp int64) *http.Cookie {
	return &http.Cookie{
		Name:     "jwt",
		Value:    token,
		MaxAge:   int(exp - time.Now().Unix()),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	}
}

func RefreshJWT(claims jwt.MapClaims) (*http.Cookie, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))
	exp := time.Now().Add(time.Minute * 5).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    claims["id"],
		"email": claims["email"],
		"exp":   exp,
	})
	jwt, err := token.SignedString(secret)
	if err != nil {
		return nil, err
	}

	cookie := newJwtCookie(jwt, exp)

	return cookie, nil
}

func CreateJWTCookie(user *db.User) (*http.Cookie, error) {
	jwt, err := CreateJWT(user)
	if err != nil {
		return nil, err
	}
	exp := time.Now().Add(time.Minute * 5).Unix()
	cookie := newJwtCookie(jwt, exp)

	return cookie, nil
}
