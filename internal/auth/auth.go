package auth

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/mpm1900/gokapi/internal/db"
)

func getKey(token *jwt.Token) (any, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))
	return secret, nil
}

func HashPassword(password string) (string, string, error) {
	salt := uuid.New().String()
	salted := fmt.Sprintf("%s$%s", password, salt)
	hashed, err := bcrypt.GenerateFromPassword([]byte(salted), bcrypt.DefaultCost)
	if err != nil {
		return "", "", err
	}
	return string(hashed), salt, nil
}

func CheckPasswords(a, b, salt string) error {
	salted := fmt.Sprintf("%s$%s", a, salt)
	return bcrypt.CompareHashAndPassword([]byte(b), []byte(salted))
}

func WithJWT(next http.HandlerFunc, queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("jwt")
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		jwt, err := ValidateJWT(cookie.Value, queries)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		ctxWithJWT := context.WithValue(r.Context(), "jwt", jwt)
		next(w, r.Clone(ctxWithJWT))
	}
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

func GetUUIDFromJWTClaims(claims jwt.MapClaims) (uuid.UUID, error) {
	id, ok := claims["id"].(string)
	if !ok {
		return uuid.Nil, errors.New("failed to parse id")
	}
	userID, err := uuid.Parse(id)
	if err != nil {
		return uuid.Nil, err
	}
	return userID, nil
}

func ValidateJWTClaims(claims jwt.MapClaims) error {
	return jwt.NewValidator().Validate(claims)
}

func ValidateJWT(token string, queries *db.Queries) (jwt.MapClaims, error) {
	claims, err := ParseJWT(token)
	if err != nil {
		return nil, err
	}
	if err := ValidateJWTClaims(claims); err != nil {
		return nil, err
	}

	tokenJwtVersionFloat, ok := claims["jwt_version"].(float64)
	if !ok {
		return nil, errors.New("failed to parse jwt_version as float64")
	}
	tokenJwtVersion := int32(tokenJwtVersionFloat)

	/* currently we are fetching the jwt_version from postgres, but
	 * we should consider using redis or something down the line
	 */
	userID, err := uuid.Parse(claims["id"].(string))
	dbJwtVersion, err := queries.GetUserJwtVersion(context.Background(), userID)
	if err != nil {
		return nil, err
	}

	if dbJwtVersion != tokenJwtVersion {
		return nil, errors.New("jwt_version mismatch")
	}
	return claims, nil
}

func CreateJWT(user *db.User) (string, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))
	exp := time.Now().Add(time.Minute * 5).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":          user.ID,
		"email":       user.Email,
		"jwt_version": user.JwtVersion,
		"exp":         exp,
	})
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func NewJwtCookie(token string, exp int64) *http.Cookie {
	return &http.Cookie{
		Name:     "jwt",
		Value:    token,
		Path:     "/",
		MaxAge:   int(exp - time.Now().Unix()),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	}
}

func RefreshJWT(claims jwt.MapClaims) (*http.Cookie, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))
	exp := time.Now().Add(time.Minute * 5).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":          claims["id"],
		"email":       claims["email"],
		"jwt_version": claims["jwt_version"],
		"exp":         exp,
	})
	jwt, err := token.SignedString(secret)
	if err != nil {
		return nil, err
	}

	cookie := NewJwtCookie(jwt, exp)

	return cookie, nil
}

func CreateJWTCookie(user *db.User) (*http.Cookie, error) {
	jwt, err := CreateJWT(user)
	if err != nil {
		return nil, err
	}
	exp := time.Now().Add(time.Minute * 5).Unix()
	cookie := NewJwtCookie(jwt, exp)

	return cookie, nil
}
