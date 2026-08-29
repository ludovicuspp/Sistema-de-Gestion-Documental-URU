# Contexto de build: carpeta backend (padre de authentication y commons).
# Ejemplo: docker build -f authentication/Dockerfile .

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["commons/Sidae.Commons.csproj", "commons/"]
COPY ["authentication/Sidae.Authentication/Sidae.Authentication.csproj", "authentication/Sidae.Authentication/"]
RUN dotnet restore "authentication/Sidae.Authentication/Sidae.Authentication.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "authentication/Sidae.Authentication/Sidae.Authentication.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "authentication/Sidae.Authentication/Sidae.Authentication.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Sidae.Authentication.dll"]
